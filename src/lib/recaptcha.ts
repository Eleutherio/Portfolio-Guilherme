import { RECAPTCHA_ACTION } from "@/lib/contact-contract";

type RecaptchaApi = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
  }
}

const SCRIPT_ID = "google-recaptcha-v3";
const LOAD_TIMEOUT_MS = 10_000;
let scriptPromise: Promise<void> | undefined;

function waitUntilReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    const api = window.grecaptcha;
    if (!api) {
      reject(new Error("reCAPTCHA API unavailable"));
      return;
    }
    api.ready(resolve);
  });
}

function loadRecaptcha(siteKey: string): Promise<void> {
  if (window.grecaptcha) return waitUntilReady();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    const timeout = window.setTimeout(
      () => reject(new Error("reCAPTCHA load timeout")),
      LOAD_TIMEOUT_MS,
    );

    const finish = () => {
      window.clearTimeout(timeout);
      waitUntilReady().then(resolve, reject);
    };
    const fail = () => {
      window.clearTimeout(timeout);
      reject(new Error("reCAPTCHA load failed"));
    };

    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", fail, { once: true });

    if (!existing) {
      script.id = SCRIPT_ID;
      script.async = true;
      script.defer = true;
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}&trustedtypes=true`;
      document.head.appendChild(script);
    }
  }).catch((error) => {
    scriptPromise = undefined;
    throw error;
  });

  return scriptPromise;
}

export async function executeContactRecaptcha(): Promise<string> {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (!siteKey) throw new Error("Missing reCAPTCHA site key");

  await loadRecaptcha(siteKey);
  const token = await window.grecaptcha?.execute(siteKey, { action: RECAPTCHA_ACTION });
  if (!token) throw new Error("reCAPTCHA did not return a token");
  return token;
}
