import api from "@/api";
import { useCallback, useRef, useState } from "react";

interface sessionType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useSession() {
  const [state, setState] = useState<sessionType>({
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const ensureSessionRef = useRef<Promise<void> | null>(null);

  const ensureSession = useCallback(async (): Promise<boolean> => {
    try {
      if (ensureSessionRef.current) {
        await ensureSessionRef.current;
        return true;
      }

      ensureSessionRef.current = (async () => {
        try {
          setState((prev) => ({ ...prev, isLoading: true, error: null }));

          await api.post("/session/start");

          setState({
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          setState({
            isAuthenticated: false,
            isLoading: false,
            error: "Failed to start session",
          });
          throw error;
        }
      })();

      await ensureSessionRef.current;
      return true;
    } finally {
      ensureSessionRef.current = null;
    }
  }, []);

  const checkExistingSession = useCallback(async () => {
    try {
      await api.get("/health");
      setState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: "Failed to check session",
      });
      return false;
    }
  }, []);

  return {
    ...state,
    ensureSession,
    checkExistingSession,
  };
}
