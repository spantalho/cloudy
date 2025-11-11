import { Spinner } from "@/components/ui/spinner";
import { useMediaQuery } from "@uidotdev/usehooks";
import { AlertTriangle, Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function ConnectionWatcher({
  ready,
  error,
}: {
  ready: boolean;
  error?: boolean;
}) {
  const connectingToast = useRef<string | number | null>(null);
  const hideTimer = useRef<number | null>(null);

  const { t } = useTranslation();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const POSITION = isDesktop ? "bottom-right" : "top-center"

  useEffect(() => {
    if (!ready && !connectingToast.current) {
      connectingToast.current = toast.warning(t("connection.in_progress"), {
        id: "connection",
        description: t("connection.wait"),
        icon: <Spinner />,
        position: POSITION,
        duration: Infinity,
      });
    }

    if (ready && connectingToast.current) {
      if (error) {
        toast.message(t("connection.error"), {
          id: "connection",
          description: t("connection.later"),
          icon: <AlertTriangle size={20}/>,
          duration: 6000,
        });

        if (hideTimer.current) {
          clearTimeout(hideTimer.current);
        }
        hideTimer.current = window.setTimeout(() => {
          toast.dismiss("connection");
          connectingToast.current = null;
          hideTimer.current = null;
        }, 6000);
        return;
      }

      toast.message(t("connection.done"), {
        id: "connection",
        description: "",
        icon: <Check />,
        duration: 5000,
      });

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
      hideTimer.current = window.setTimeout(() => {
        toast.dismiss("connection");
        connectingToast.current = null;
        hideTimer.current = null;
      }, 5000);
    }

    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };
  }, [ready, error, t]);

  return null;
}
