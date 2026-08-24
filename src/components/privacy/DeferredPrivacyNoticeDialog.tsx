import { lazy, Suspense, useState, type ReactNode } from "react";

const PrivacyNoticeDialog = lazy(() =>
  import("./PrivacyNoticeDialog").then((module) => ({
    default: module.PrivacyNoticeDialog,
  })),
);

type DeferredPrivacyNoticeDialogProps = {
  children: ReactNode;
  triggerClassName?: string;
};

export function DeferredPrivacyNoticeDialog({
  children,
  triggerClassName,
}: DeferredPrivacyNoticeDialogProps) {
  const [requested, setRequested] = useState(false);

  if (!requested) {
    return (
      <button type="button" className={triggerClassName} onClick={() => setRequested(true)}>
        {children}
      </button>
    );
  }

  return (
    <Suspense
      fallback={
        <button type="button" className={triggerClassName} disabled aria-busy="true">
          {children}
        </button>
      }
    >
      <PrivacyNoticeDialog triggerClassName={triggerClassName} defaultOpen>
        {children}
      </PrivacyNoticeDialog>
    </Suspense>
  );
}
