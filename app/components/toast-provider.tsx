"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastKind = "saved" | "error";

type Toast = {
  id: number;
  kind: ToastKind;
  message: string;
};

type ToastApi = {
  showSaved: () => void;
  showError: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-2), { id, kind, message }]);
      window.setTimeout(() => dismiss(id), kind === "error" ? 4000 : 1800);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      showSaved: () => push("saved", "Saved"),
      showError: (message) => push("error", message),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="no-print pointer-events-none fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-2"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((toast) => (
          <p
            key={toast.id}
            role={toast.kind === "error" ? "alert" : "status"}
            className={`rounded-md px-3 py-2 text-sm shadow-md ${
              toast.kind === "error"
                ? "bg-red-800 text-white"
                : "bg-zinc-900 text-white"
            }`}
          >
            {toast.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return toast;
}

type ActionState = { error?: string } | null;

export function toastActionResult(
  result: ActionState,
  toast: ToastApi,
) {
  if (result?.error) {
    toast.showError(result.error);
    return;
  }
  toast.showSaved();
}

export function useToastAction<S extends ActionState>(
  action: (prev: S, formData: FormData) => Promise<S>,
  initial: S,
) {
  const toast = useToast();
  const bound = useCallback(
    async (prev: S, formData: FormData) => {
      const result = await action(prev, formData);
      toastActionResult(result, toast);
      return result;
    },
    [action, toast],
  );
  return useActionState(bound, initial);
}
