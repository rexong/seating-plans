export const BASIC_AUTH_REALM = "Seat Planning";
export const BASIC_AUTH_DENIED_BODY = "Authentication required";
export const SEATING_BASIC_COOKIE = "seating-basic";

function timingSafeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  const length = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;

  for (let i = 0; i < length; i++) {
    mismatch |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }

  return mismatch === 0;
}

export function credentialsMatch(
  header: string,
  user: string,
  password: string,
) {
  if (!header.startsWith("Basic ")) {
    return false;
  }

  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return false;
  }

  const colon = decoded.indexOf(":");
  if (colon === -1) {
    return false;
  }

  return (
    timingSafeEqual(decoded.slice(0, colon), user) &&
    timingSafeEqual(decoded.slice(colon + 1), password)
  );
}

export function isBasicAuthorized(authorizationHeader: string | null) {
  const user = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASSWORD;

  if (!user || !password || !authorizationHeader) {
    return false;
  }

  return credentialsMatch(authorizationHeader, user, password);
}

export function isCookieAuthorized(token: string | undefined) {
  return Boolean(token && isBasicAuthorized(`Basic ${token}`));
}
