import { useSyncExternalStore } from 'react';

export type ToastTone = 'success' | 'info';

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/** Show a HUD notification. It dismisses itself. */
export function notify(message: string, tone: ToastTone = 'info', duration = 2800) {
  const id = nextId++;
  // newest first, never more than three on screen
  toasts = [{ id, message, tone }, ...toasts].slice(0, 3);
  emit();
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, duration);
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useToasts(): Toast[] {
  return useSyncExternalStore(
    subscribe,
    () => toasts,
    () => toasts,
  );
}
