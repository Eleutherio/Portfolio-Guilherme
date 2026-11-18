import { useState, type ReactNode } from "react";
import { useApp } from "@/i18n/AppContext";
type DialogComponent = typeof import("./PrivacyNoticeDialog").PrivacyNoticeDialog;

type DeferredPrivacyNoticeDialogProps = {
  children: ReactNode;
  triggerClassName?: string;
};

export function DeferredPrivacyNoticeDialog({
  children,
  triggerClassName,
}: DeferredPrivacyNoticeDialogProps) {
  const { lang } = useApp();
  const [Dialog, setDialog] = useState<DialogComponent | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const request = async () => {
    if (loading) return;
    setLoading(true);
    setFailed(false);
    try {
      const module = await import("./PrivacyNoticeDialog");
      setDialog(() => module.PrivacyNoticeDialog);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  if (!Dialog) {
    return (
      <>
        <button
          type="button"
          className={triggerClassName}
          onClick={() => void request()}
          disabled={loading}
          aria-busy={loading}
          aria-haspopup="dialog"
        >
          {children}
        </button>
        {failed && (
          <span role="alert" className="sr-only">
            {lang === "pt"
              ? "Não foi possível carregar o aviso de privacidade. Tente novamente."
              : "The privacy notice could not be loaded. Please try again."}
          </span>
        )}
        {failed && (
          <a href="/privacidade" className="touch-target inline-flex items-center underline">
            {lang === "pt" ? "Ver aviso de privacidade" : "Read the privacy notice"}
          </a>
        )}
      </>
    );
  }

  return (
    <Dialog triggerClassName={triggerClassName} defaultOpen>
      {children}
    </Dialog>
  );
}
