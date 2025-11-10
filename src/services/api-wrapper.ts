import api from "@/api";
import { sessionManager } from "@/managers/session-manager";
import type { AxiosRequestConfig } from "axios";

const NODE_ENV = import.meta.env.NODE_ENV as
  | "production"
  | "development"
  | "staging";

class ApiWrapper {
  private concurrentRequests = new Set<string>();
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  private async throttleRequest<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    if (this.concurrentRequests.has(key)) {
      if (NODE_ENV !== "production") {
        console.log(`Request ${key} already in progress, waiting...`);
      }
      return new Promise((resolve, reject) => {
        const queuedRequest = async () => {
          try {
            const result = await requestFn();
            resolve(result);
          } catch (err) {
            reject(err);
          }
        };
        this.requestQueue.push(queuedRequest);
        this.processQueue();
      });
    }

    this.concurrentRequests.add(key);

    try {
      return await requestFn();
    } finally {
      this.concurrentRequests.delete(key);
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const req = this.requestQueue.shift();
      if (req) {
        try {
          await req();
          await this.delay(100);
        } catch (err) {
          console.error("Error processing queued request:", err);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  private async ensureSessionAndRequest<T>(
    requestFn: () => Promise<T>,
    operation: string = "request"
  ): Promise<T> {
    const requestKey = `${operation}-${Date.now()}-${Math.random()}`;

    return this.throttleRequest(requestKey, async () => {
      try {
        const sessionOk = await sessionManager.ensureSession();
        if (!sessionOk) {
          throw new Error("Session initialization failed");
        }
        return await requestFn();
      } catch (err: any) {
        if (err.response?.status === 401 && err.config?._retried) {
          if (NODE_ENV !== "production") {
            console.warn("(401) Session expired, attempting renewal...");
          }

          try {
            sessionManager.resetSession();
            const renewed = await sessionManager.ensureSession();

            if (!renewed) {
              throw new Error("Session renewal failed");
            }

            const retryConfig = {
              ...err.config,
              _retried: true,
            };

            if (NODE_ENV !== "production") {
              console.log("Retrying request after session renewal...");
            }

            return await api.request(retryConfig).then((r) => r.data);
          } catch (renewErr) {
            console.error("Session renewal failed:", renewErr);
            throw renewErr;
          }
        }

        throw err;
      }
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.ensureSessionAndRequest(
      () =>
        api
          .get<T>(url, { ...config, withCredentials: true })
          .then((r) => r.data),
      `GET:${url}`
    );
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.ensureSessionAndRequest(
      () =>
        api
          .post<T>(url, data, { ...config, withCredentials: true })
          .then((r) => r.data),
      `POST:${url}`
    );
  }
}

export const apiWrapper = new ApiWrapper();
