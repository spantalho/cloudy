import { sessionManager } from "@/managers/session-manager";
import { useCallback, useEffect, useState } from "react";

interface SessionData {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useSession() {
  const [state, setState] = useState<SessionData>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const ensureSession = useCallback(async (): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const success = await sessionManager.ensureSession();

      setState({
        isAuthenticated: success,
        isLoading: false,
        error: success ? null : "Failed to start session.",
      });

      return success;
    } catch (err: any) {
      const errorMsg =
        err.response?.status === 429
          ? "Too many attempts, please try again later"
          : "Failed to start session";

      setState({
        isAuthenticated: false,
        isLoading: false,
        error: errorMsg,
      });
      return false;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = sessionManager.subscribe((initialized) => {
      setState((prev) => ({
        ...prev,
        isAuthenticated: initialized,
        isLoading: false,
        error: initialized ? null : prev.error,
      }));
    });

    setState((prev) => ({
      ...prev,
      isAuthenticated: sessionManager.getSessionStatus(),
    }));

    return unsubscribe;
  }, []);

  const renewSession = useCallback(async (): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const success = await sessionManager.renewSession();

      setState({
        isAuthenticated: success,
        isLoading: false,
        error: success ? null : "Failed to renew session",
      });

      return success;
    } catch (err) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: "Failed to renew session",
      });
      return false;
    }
  }, []);

  return {
    ...state,
    ensureSession,
    renewSession,
  };
}
