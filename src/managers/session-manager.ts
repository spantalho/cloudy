import api from "../api";

const MODE = import.meta.env.VITE_APP_ENV as
  | "production"
  | "development"
  | "staging";

class SessionManager {
  private sessionPromise: Promise<boolean> | null = null;
  private isInitialized = false;
  private listeners: ((initialized: boolean) => void)[] = [];

  // retry controls
  private retryCount = 0;
  private maxRetries = 3;
  private baseDelay = 1000;
  private maxDelay = 10000;
  private lastAttemptTime = 0;
  private minTimeBetweenRetries = 2000;

  private hasPermanentlyFailed = false;
  private permanentFailureTimeout: NodeJS.Timeout | null = null;
  private readonly permanentFailureBlockTime = 30000;

  async ensureSession(): Promise<boolean> {
    if (this.hasPermanentlyFailed) {
      console.warn("Session initialization has permanently failed.");
      return false;
    }

    if (this.isInitialized) {
      return true;
    }

    if (this.sessionPromise) {
      return this.sessionPromise;
    }

    const now = Date.now();
    const timeSinceLastAttempt = now - this.lastAttemptTime;

    if (
      this.lastAttemptTime > 0 &&
      timeSinceLastAttempt < this.minTimeBetweenRetries
    ) {
      const waitTime = this.minTimeBetweenRetries - timeSinceLastAttempt;
      await this.delay(waitTime);
    }

    this.sessionPromise = this.initializeSessionWithRetry();
    try {
      const result = await this.sessionPromise;
      return result;
    } finally {
      this.sessionPromise = null;
    }
  }

  getSessionStatus(): boolean {
    return this.isInitialized;
  }

  resetSession(): void {
    this.isInitialized = false;
    this.sessionPromise = null;
    this.retryCount = 0;
    this.hasPermanentlyFailed = false;

    if (this.permanentFailureTimeout) {
      clearTimeout(this.permanentFailureTimeout);
      this.permanentFailureTimeout = null;
    }

    this.notifyListeners(false);
  }

  async renewSession(): Promise<boolean> {
    if (MODE !== "production") {
      console.log("forcing session renewal...");
    }
    this.resetSession();
    return this.ensureSession();
  }

  subscribe(listener: (initialized: boolean) => void): () => void {
    this.listeners.push(listener);

    // unsubscribe func.
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private async initializeSessionWithRetry(): Promise<boolean> {
    while (this.retryCount <= this.maxRetries) {
      this.lastAttemptTime = Date.now();

      try {
        if (MODE !== "production") {
          console.log(
            "Initializing session...",
            this.retryCount > 0
              ? `(Attempt ${this.retryCount + 1}/${this.maxRetries})`
              : ""
          );
        }

        const response = await api.post(
          "/session/start",
          {},
          {
            withCredentials: true,
            timeout: 10000,
          }
        );

        if (response.status === 200 || response.status === 201) {
          this.retryCount = 0;
          this.isInitialized = true;
          this.hasPermanentlyFailed = false;

          if (this.permanentFailureTimeout) {
            clearTimeout(this.permanentFailureTimeout);
            this.permanentFailureTimeout = null;
          }

          this.notifyListeners(true);

          if (MODE !== "production") {
            console.log("Session initialized sucessfully.");
          }

          return true;
        }

        throw new Error(`Unexpected status: ${response.status}`);
      } catch (err: any) {
        console.error(
          `
          Session initialization failed (attempt ${this.retryCount + 1}/${
            this.maxRetries + 1
          }):`,
          {
            message: err.message,
            status: err.response?.status,
            code: err.code,
          }
        );

        this.retryCount++;

        if (this.retryCount <= this.maxRetries) {
          const delayTime = this.calculateBackoffDelay();
          if (MODE !== "production") {
            console.log(
              `Retrying in ${delayTime}ms... (${this.retryCount}/${
                this.maxRetries + 1
              })`
            );
          }
          await this.delay(delayTime);
        } else {
          console.error(
            "Max retry attempts reached, session initialization failed permanently"
          );
          this.isInitialized = false;
          this.hasPermanentlyFailed = true;
          this.notifyListeners(false);

          this.permanentFailureTimeout = setTimeout(() => {
            if (MODE !== "production") {
              console.log("Automatic unblock after permanent failure timeout");
            }
            this.hasPermanentlyFailed = false;
            this.retryCount = 0;
          }, this.permanentFailureBlockTime);

          return false;
        }
      }
    }

    return false;
  }

  private notifyListeners(initialized: boolean): void {
    this.listeners.forEach((listener) => {
      try {
        listener(initialized);
      } catch (err) {
        console.error("Error in session listener:", err);
      }
    });
  }

  private calculateBackoffDelay(): number {
    const exponentialDelay = this.baseDelay * Math.pow(2, this.retryCount - 1);
    const jitter = Math.random() * 1000;
    const delay = Math.min(exponentialDelay + jitter, this.maxDelay);

    return delay;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const sessionManager = new SessionManager();
