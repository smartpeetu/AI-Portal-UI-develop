// src/services/authService.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import UserSessionManager from "@/modules/UserSessionManager";

export type LambdaAuthResponse = {
  message?: string;
  id_token_claims?: {
    sub?: string;
    crm_FedId?: string;
    FederationIdentifier?: string;
    exp?: number;
    iss?: string;
  };
  access_token_claims?: {
    ver?: number;
    jti?: string;
    iss?: string;
    aud?: string;
    iat?: number;
    exp?: number;
    cid?: string;
    uid?: string;
    scp?: string[];
    auth_time?: number;
    sub?: string;
  };
  identity_token?: string;
  scopes?: string[];
  event?: {
    headers?: Record<string, string>;
  };
};

const DEFAULT_ENDPOINT =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? `https://dev-ai.aws-${import.meta.env.VITE_ORG_NAME.toLowerCase()}.com/lambda-test/`
    : "/lambda-test/";

const AUTH_COOKIE_NAME = "AWSELBAuthSessionCookie-0";

const session = new UserSessionManager();

function toHeaderCaseMap(headers?: Record<string, string>) {
  const map = new Map<string, string>();
  if (!headers) return map;
  for (const [k, v] of Object.entries(headers)) {
    map.set(k.toLowerCase(), v);
  }
  return map;
}

export function hasAlbAuthCookie(cookieName: string = AUTH_COOKIE_NAME) {
  if (typeof document === "undefined") return false;
  return document.cookie.includes(cookieName);
}

export function getAuthHeader() {
  const token = session.accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function logout() {
  try {
    session.clearLocal();
  } catch {
    // no-op
  }
}

/**
 * Login flow:
 *  - On localhost: create a mock user (no network call)
 *  - On deployed: call the ALB-protected lambda endpoint and parse claims
 */
export async function loginViaAlbLambda(endpoint?: string) {
  // 👇 Mock login for localhost
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "localhost"
  ) {
    const mockUser = {
      username: "Hardik Soni",
      email: `hardik.soni@${import.meta.env.VITE_ORG_NAME.toLowerCase()}.com`,
      federationId: "LOCAL_DEV",
      oktaUserId: "local-uid",
      issuer: "http://localhost",
      accessExp: Math.floor(Date.now() / 1000) + 3600, // +1h
      idExp: Math.floor(Date.now() / 1000) + 3600,
      scopes: ["openid"],
    };

    session.accessToken = "fake-access-token";
    session.idToken = "fake-id-token";
    session.username = mockUser.username;
    session.user = mockUser;
    session.isOktaEnabled = false;

    localStorage.setItem("isAuthenticated", JSON.stringify(true));

    return {
      tokens: {
        accessTokenJwt: "fake-access-token",
        idTokenJwt: "fake-id-token",
      },
      claims: { idClaims: {}, accessClaims: {} },
      user: mockUser,
    };
  }

  // Real login for deployed env
  const url = endpoint ?? DEFAULT_ENDPOINT;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Auth endpoint failed: ${res.status} ${res.statusText}`);
  }

  let data: LambdaAuthResponse;
  try {
    data = (await res.json()) as LambdaAuthResponse;
  } catch {
    throw new Error("Auth endpoint did not return valid JSON");
  }

  const headerMap = toHeaderCaseMap(data?.event?.headers);
  const accessTokenJwt = headerMap.get("x-amzn-oidc-accesstoken") ?? null;
  const idTokenJwt = headerMap.get("x-amzn-oidc-data") ?? null;

  const idClaims = data?.id_token_claims ?? {};
  const accessClaims = data?.access_token_claims ?? {};

  const username =
    idClaims.crm_FedId ||
    (accessClaims.sub ? accessClaims.sub.split("@")[0] : undefined) ||
    idClaims.sub ||
    "user";

  const user = {
    username,
    email: accessClaims.sub ?? null,
    federationId: idClaims.FederationIdentifier ?? null,
    oktaUserId: idClaims.sub ?? null,
    issuer: idClaims.iss ?? accessClaims.iss ?? null,
    accessExp: accessClaims.exp ?? null,
    idExp: idClaims.exp ?? null,
    scopes: data?.scopes ?? [],
  };

  session.accessToken = accessTokenJwt;
  session.idToken = idTokenJwt;
  session.username = username ?? null;
  session.user = user;
  session.isOktaEnabled = true;

  localStorage.setItem("isAuthenticated", JSON.stringify(true));

  return {
    tokens: { accessTokenJwt, idTokenJwt },
    claims: { idClaims, accessClaims },
    user,
  };
}
