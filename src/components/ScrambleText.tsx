import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { useViewportActivity } from "@/components/ViewportActivity";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const FRAME_INTERVAL = 32;

function randomFrom(characters: string) {
  return characters[Math.floor(Math.random() * characters.length)] ?? "";
}

function scrambleCharacter(character: string) {
  if (/\s/u.test(character)) return character;
  if (/\d/u.test(character)) return randomFrom(NUMBERS);
  if (/\p{Lu}/u.test(character)) return randomFrom(UPPERCASE);
  if (/\p{Ll}/u.test(character)) return randomFrom(LOWERCASE);
  return character;
}

function scramble(value: string) {
  return Array.from(value, scrambleCharacter).join("");
}

type ScrambleTextProps = {
  text: string;
  active?: boolean;
  renderDisplayed?: (displayed: string) => ReactNode;
};

export function ScrambleText({ text, active: activeOverride, renderDisplayed }: ScrambleTextProps) {
  const reducedMotion = useReducedMotion();
  const viewportActive = useViewportActivity();
  const active = activeOverride ?? viewportActive;
  const [displayed, setDisplayed] = useState(active ? text : "");
  const displayedRef = useRef(active ? text : "");

  useEffect(() => {
    const update = (value: string) => {
      displayedRef.current = value;
      setDisplayed(value);
    };

    if (!active) return;

    if (reducedMotion) {
      update(text);
      return;
    }

    const previous = displayedRef.current;
    if (previous === text) return;

    const deleteDuration = Math.min(320, Math.max(150, previous.length * 7));
    const typeDuration = Math.min(760, Math.max(340, text.length * 10));
    const totalDuration = deleteDuration + typeDuration;
    let animationFrame = 0;
    let lastFrame = 0;
    let startedAt = 0;

    const animate = (timestamp: number) => {
      if (!startedAt) startedAt = timestamp;
      const elapsed = timestamp - startedAt;

      if (timestamp - lastFrame >= FRAME_INTERVAL) {
        lastFrame = timestamp;

        if (elapsed < deleteDuration) {
          const progress = elapsed / deleteDuration;
          const remaining = Math.ceil(previous.length * (1 - progress));
          update(scramble(previous.slice(0, remaining)));
        } else {
          const progress = Math.min(1, (elapsed - deleteDuration) / typeDuration);
          const stableLength = Math.floor(text.length * progress);
          const frontierEnd = Math.min(text.length, stableLength + 3);
          update(text.slice(0, stableLength) + scramble(text.slice(stableLength, frontierEnd)));
        }
      }

      if (elapsed < totalDuration) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        update(text);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [active, reducedMotion, text]);

  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {renderDisplayed ? renderDisplayed(displayed) : displayed || "\u00a0"}
      </span>
    </span>
  );
}
