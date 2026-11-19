import { useSyncExternalStore } from "react";

export const PAGE_PREPARED_EVENT = "portfolio:page-prepared";
export const PAGE_REVEALED_EVENT = "portfolio:page-revealed";
export const PAGE_PREPARATION_ERROR_EVENT = "portfolio:page-preparation-error";
const initialTasks = new Set<Promise<unknown>>();

export function registerInitialTask<T>(task: Promise<T>): Promise<T> {
  initialTasks.add(task);
  void task.then(
    () => initialTasks.delete(task),
    () => initialTasks.delete(task),
  );
  return task;
}

export async function waitForInitialTasks() {
  while (initialTasks.size) await Promise.allSettled([...initialTasks]);
}

function subscribe(listener: () => void) {
  window.addEventListener(PAGE_REVEALED_EVENT, listener);
  return () => window.removeEventListener(PAGE_REVEALED_EVENT, listener);
}

export function usePageRevealed() {
  return useSyncExternalStore(
    subscribe,
    () =>
      document.documentElement.dataset.pageRevealed === "true" ||
      !document.getElementById("site-preloader"),
    () => false,
  );
}
