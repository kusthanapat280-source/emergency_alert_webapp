const SESSION_KEY = "operator_auth";
const EXPIRY_KEY = "operator_auth_expiry";
const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export function setOperatorSession(): void {
  localStorage.setItem(SESSION_KEY, "true");
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + TIMEOUT_MS));
}

export function clearOperatorSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

export function isOperatorSessionValid(): boolean {
  try {
    const auth = localStorage.getItem(SESSION_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (auth !== "true" || !expiry) return false;
    return Date.now() < parseInt(expiry, 10);
  } catch {
    return false;
  }
}

export function refreshOperatorSession(): void {
  try {
    if (localStorage.getItem(SESSION_KEY) === "true") {
      localStorage.setItem(EXPIRY_KEY, String(Date.now() + TIMEOUT_MS));
    }
  } catch {
    // ignore
  }
}
