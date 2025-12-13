// src/services/axiosInstance.ts
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type RawAxiosResponseHeaders,
  type AxiosResponseHeaders,
  type AxiosRequestHeaders,
} from "axios";
import qs from "qs";
import UserSessionManager from "@/modules/UserSessionManager";

/* ---------------------------------- ENV ---------------------------------- */
const baseURL = (import.meta.env.VITE_API_BASE_URL as string) ?? "/";
const timeout = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 60_000;
const TENANT_ID = (import.meta.env.VITE_TENANT_ID as string) ?? "";

/* -------------------------------- SESSION -------------------------------- */
const session = new UserSessionManager();

/* ------------------------ custom outbound header names -------------------- */
const HDR = {
  tenant: "X-Tenant-Id",
  idToken: "X-Id-Token",
  username: "X-Username",
  userEmail: "X-User-Email",
  envirnment: "X-Environment",
} as const;

/* ----------------------- build per-request auth headers ------------------- */
function buildAuthHeaders(): Record<string, string> {
  const accessToken = session.accessToken ?? undefined;
  const idToken = session.idToken ?? undefined;
  const username = session.username ?? undefined;
  const email = session.user?.email ?? undefined;
  const env = import.meta.env.VITE_ENV ?? "local";

  const h: Record<string, string> = {};
  if (accessToken) h.Authorization = `Bearer ${accessToken}`;
  if (idToken) h[HDR.idToken] = idToken;
  if (username) h[HDR.username] = String(username);
  if (email) h[HDR.userEmail] = String(email);
  if (TENANT_ID) h[HDR.tenant] = TENANT_ID;
  if (env) h[HDR.envirnment] = env;
  return h;
}

/* ------------------------- header normalization helpers ------------------ */
function headersToRecord(
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders,
): Record<string, string> | undefined {
  if (!headers) return undefined;

  // AxiosHeaders instance (v1)
  if (headers instanceof AxiosHeaders) {
    return headers;
  }

  // Some builds expose toJSON on the plain object
  const maybeToJSON = (headers as { toJSON?: () => Record<string, unknown> })
    .toJSON;
  if (typeof maybeToJSON === "function") {
    const obj = maybeToJSON();
    const rec: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v != null) rec[k.toLowerCase()] = String(v);
    }
    return rec;
  }

  // Fallback: best-effort cast
  const rec: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers as Record<string, unknown>)) {
    if (v != null) rec[k.toLowerCase()] = String(v);
  }
  return rec;
}

function headerGetString(
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
  key: string,
): string | undefined {
  if (headers instanceof AxiosHeaders) {
    const v = headers.get(key); // AxiosHeaderValue | null
    return v == null ? undefined : String(v);
  }
  const obj = headers as Record<string, unknown>;
  const v = obj[key] ?? obj[key.toLowerCase()] ?? obj[key.toUpperCase()];
  return v == null ? undefined : String(v);
}

function readTraceId(
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders,
): string | null {
  if (!headers) return null;
  return (
    headerGetString(headers, "x-trace-id") ||
    headerGetString(headers, "x-request-id") ||
    headerGetString(headers, "trace-id") ||
    null
  );
}

/* ----------------------------- error shaping ----------------------------- */
export type NormalizedHttpError = {
  status: number; // 0 = network/CORS/timeout
  message: string;
  code?: string;
  data?: unknown;
  traceId?: string | null;
  url?: string;
  method?: string;
  headers?: Record<string, string>;
};

function extractServerMessage(data: unknown, fallback: string): string {
  if (typeof data === "string") return data || fallback;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const fromKnown =
      (typeof obj.message === "string" && obj.message) ||
      (typeof obj.error === "string" && obj.error) ||
      (typeof obj.detail === "string" && obj.detail);
    if (fromKnown) return fromKnown;
  }
  return fallback;
}

function normalizeAxiosError(error: AxiosError): NormalizedHttpError {
  if (error.response) {
    const resp = error.response as AxiosResponse & {
      config: InternalAxiosRequestConfig;
    };

    const headersRec = headersToRecord(resp.headers);
    const traceId = readTraceId(resp.headers);
    const message = extractServerMessage(
      resp.data,
      resp.statusText || "Request failed",
    );

    return {
      status: resp.status,
      message,
      code: error.code,
      data: resp.data,
      traceId,
      url: resp.config?.url,
      method: resp.config?.method?.toUpperCase(),
      headers: headersRec,
    };
  }

  // Network/CORS/timeout/abort
  return {
    status: 0,
    message: error.message || "Network error",
    code: error.code,
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
  };
}

/* ----------------------------- axios instance ---------------------------- */
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout,
  headers: AxiosHeaders.from({
    "Content-Type": "application/json",
  }) as AxiosRequestHeaders,
  paramsSerializer: {
    serialize: (params) =>
      qs.stringify(params, { arrayFormat: "repeat", skipNulls: true }),
  },
});

/* ----------------------------- request hook ------------------------------ */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Merge headers safely via AxiosHeaders
    const merged = AxiosHeaders.from({
      ...(config.headers || {}),
      ...buildAuthHeaders(),
    }) as AxiosRequestHeaders;
    config.headers = merged;

    if (import.meta.env.DEV) {
      // Redact sensitive headers from logs
      const safe = new AxiosHeaders(merged).toJSON();
      delete safe.authorization;
      delete safe[HDR.idToken.toLowerCase()];
      // eslint-disable-next-line no-console
      console.debug(
        "[HTTP] →",
        config.method?.toUpperCase(),
        config.baseURL ? `${config.baseURL}${config.url}` : config.url,
        { headers: safe, params: config.params },
      );
    }

    return config;
  },
  (error) => Promise.reject(normalizeAxiosError(error)),
);

/* ---------------------------- response hook ------------------------------ */
axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[HTTP] ←", response.status, response.config?.url);
    }
    return response;
  },
  (error: AxiosError) => {
    const normalized = normalizeAxiosError(error);

    // Global auth handling (optional)
    if (normalized.status === 401 || normalized.status === 419) {
      session.clearLocal();
      window.location.replace("/login");
    }

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[HTTP] ✖", normalized);
    }
    return Promise.reject(normalized);
  },
);

export default axiosInstance;
