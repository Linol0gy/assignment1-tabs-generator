export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const originalFetch = globalThis.fetch;

  if (!(globalThis as Record<string, unknown>).__instrumentedFetch) {
    const traces: Array<{ url: string; duration: number }> = [];
    (globalThis as Record<string, unknown>).__instrumentedFetch = true;
    (globalThis as Record<string, unknown>).__instrumentationTraces = traces;

    globalThis.fetch = async (...args) => {
      const [input, init] = args;
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      const start = Date.now();
      try {
        const response = await originalFetch(input as any, init as any);
        const duration = Date.now() - start;
        traces.push({ url, duration });
        if (process.env.NODE_ENV !== "production") {
          console.info(`[instrumentation] fetch ${url} ${duration}ms`);
        }
        return response;
      } catch (error) {
        const duration = Date.now() - start;
        traces.push({ url, duration });
        throw error;
      }
    };
  }
}
