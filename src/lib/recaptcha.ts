import { RECAPTCHA_ACTION } from "@/lib/contact-shared";

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

function removeInvalidRecaptchaResource(): void {
  document.getElementById(SCRIPT_ID)?.remove();
  window.grecaptcha = undefined;
}

function waitUntilReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    const api = window.grecaptcha;
    if (!api) {
      reject(new Error("reCAPTCHA API unavailable"));
      return;
    }
    const timeout = window.setTimeout(
      () => reject(new Error("reCAPTCHA ready timeout")),
      LOAD_TIMEOUT_MS,
    );
    try {
      api.ready(() => {
        window.clearTimeout(timeout);
        resolve();
      });
    } catch (error) {
      window.clearTimeout(timeout);
      reject(error);
    }
  });
}

function loadRecaptcha(siteKey: string): Promise<void> {
  if (window.grecaptcha) {
    return waitUntilReady().catch((error) => {
      removeInvalidRecaptchaResource();
      scriptPromise = undefined;
      throw error;
    });
  }
  if (scriptPromise) return scriptPromise;

  document.getElementById(SCRIPT_ID)?.remove();
  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    let settled = false;

    const cleanup = () => {
      window.clearTimeout(timeout);
      script.removeEventListener("load", finish);
      script.removeEventListener("error", fail);
    };
    const succeed = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const rejectAndReset = (error: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      removeInvalidRecaptchaResource();
      reject(error);
    };

    const finish = () => {
      const api = window.grecaptcha;
      if (!api) {
        rejectAndReset(new Error("reCAPTCHA API unavailable"));
        return;
      }
      try {
        api.ready(succeed);
      } catch (error) {
        rejectAndReset(error instanceof Error ? error : new Error("reCAPTCHA API unavailable"));
      }
    };
    const fail = () => rejectAndReset(new Error("reCAPTCHA load failed"));
    const timeout = window.setTimeout(
      () => rejectAndReset(new Error("reCAPTCHA load timeout")),
      LOAD_TIMEOUT_MS,
    );

    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", fail, { once: true });
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}&trustedtypes=true`;
    document.head.appendChild(script);
  }).catch((error) => {
    scriptPromise = undefined;
    throw error;
  });

  return scriptPromise;
}

export async function executeContactRecaptcha(): Promise<string> {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim();
  if (!siteKey) throw new Error("Missing reCAPTCHA site key");

  await loadRecaptcha(siteKey);
  const token = await window.grecaptcha?.execute(siteKey, { action: RECAPTCHA_ACTION });
  if (!token) throw new Error("reCAPTCHA did not return a token");
  return token;
}
