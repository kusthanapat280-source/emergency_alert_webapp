const SESSION_KEY = "admin_auth";
const EXPIRY_KEY = "admin_auth_expiry";
const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export function setAdminSession(): void {
  localStorage.setItem(SESSION_KEY, "true");
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + TIMEOUT_MS));
}

export function clearAdminSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

export function isAdminSessionValid(): boolean {
  try {
    const auth = localStorage.getItem(SESSION_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (auth !== "true" || !expiry) return false;
    return Date.now() < parseInt(expiry, 10);
  } catch {
    return false;
  }
}

export function refreshAdminSession(): void {
  try {
    if (localStorage.getItem(SESSION_KEY) === "true") {
      localStorage.setItem(EXPIRY_KEY, String(Date.now() + TIMEOUT_MS));
    }
  } catch {
    // ignore
  }
}
