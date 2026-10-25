/**
 * Security utilities for Hira Jewellers Admin Panel
 */

const ADMIN_SALT = "hj_salt_v1";
const ADMIN_PASSWORD_HASH = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"; // SHA-256(hj_salt_v1 + 123) - CHANGE THIS!
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const STORAGE_KEYS = {
  AUTH: "hj_admin_auth",
  AUTH_TIME: "hj_admin_auth_time",
  LOGIN_ATTEMPTS: "hj_login_attempts",
  LOCKOUT_UNTIL: "hj_lockout_until",
};

/**
 * SHA-256 hash function
 */
export async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Check if user is locked out
 */
export function isLockedOut() {
  const lockoutUntil = localStorage.getItem(STORAGE_KEYS.LOCKOUT_UNTIL);
  if (!lockoutUntil) return false;
  
  const lockoutTime = parseInt(lockoutUntil, 10);
  if (Date.now() < lockoutTime) {
    return true;
  }
  
  localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);
  localStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
  return false;
}

/**
 * Get remaining lockout time in seconds
 */
export function getLockoutRemaining() {
  const lockoutUntil = localStorage.getItem(STORAGE_KEYS.LOCKOUT_UNTIL);
  if (!lockoutUntil) return 0;
  
  const remaining = parseInt(lockoutUntil, 10) - Date.now();
  return Math.max(0, Math.ceil(remaining / 1000));
}

/**
 * Record failed login attempt
 */
function recordFailedAttempt() {
  const attempts = parseInt(localStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS) || "0", 10) + 1;
  localStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, attempts.toString());
  
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    localStorage.setItem(STORAGE_KEYS.LOCKOUT_UNTIL, lockoutUntil.toString());
  }
  
  return attempts;
}

/**
 * Clear login attempts on successful login
 */
function clearLoginAttempts() {
  localStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
  localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);
}

/**
 * Verify admin password
 */
export async function verifyPassword(password) {
  if (isLockedOut()) {
    return { success: false, error: "Account locked. Try again later.", locked: true };
  }
  
  const hash = await sha256(ADMIN_SALT + password);
  
  if (hash === ADMIN_PASSWORD_HASH) {
    clearLoginAttempts();
    sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
    sessionStorage.setItem(STORAGE_KEYS.AUTH_TIME, Date.now().toString());
    return { success: true };
  }
  
  const attempts = recordFailedAttempt();
  const remaining = MAX_LOGIN_ATTEMPTS - attempts;
  
  if (remaining <= 0) {
    return { 
      success: false, 
      error: `Too many failed attempts. Account locked for 15 minutes.`,
      locked: true 
    };
  }
  
  return { 
    success: false, 
    error: `Incorrect password. ${remaining} attempts remaining.`,
    locked: false 
  };
}

/**
 * Check if admin is authenticated
 */
export function isAuthenticated() {
  const auth = sessionStorage.getItem(STORAGE_KEYS.AUTH);
  const authTime = sessionStorage.getItem(STORAGE_KEYS.AUTH_TIME);
  
  if (auth !== "true" || !authTime) {
    return false;
  }
  
  const elapsed = Date.now() - parseInt(authTime, 10);
  if (elapsed > SESSION_TIMEOUT_MS) {
    logout();
    return false;
  }
  
  return true;
}

/**
 * Refresh session timeout
 */
export function refreshSession() {
  if (isAuthenticated()) {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_TIME, Date.now().toString());
  }
}

/**
 * Logout admin
 */
export function logout() {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_TIME);
}

/**
 * Sanitize text input to prevent XSS
 */
export function sanitizeInput(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 1000);
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(url) {
  if (!url) return "";
  const trimmed = url.trim();
  
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:")) {
    return "";
  }
  
  return trimmed;
}

/**
 * Validate Google Drive URL
 */
export function isValidImageUrl(url) {
  if (!url) return false;
  
  const allowedPatterns = [
    /^https:\/\/drive\.google\.com\//,
    /^https:\/\/lh3\.googleusercontent\.com\//,
    /^https:\/\/images\.pexels\.com\//,
    /^https:\/\/via\.placeholder\.com\//,
    /^https:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i,
  ];
  
  return allowedPatterns.some(pattern => pattern.test(url));
}

/**
 * Log admin action (for audit trail)
 */
export function logAdminAction(action, details = {}) {
  const logs = JSON.parse(localStorage.getItem("hj_admin_logs") || "[]");
  
  logs.unshift({
    action,
    details,
    timestamp: new Date().toISOString(),
  });
  
  localStorage.setItem("hj_admin_logs", JSON.stringify(logs.slice(0, 100)));
}

/**
 * Get admin action logs
 */
export function getAdminLogs() {
  return JSON.parse(localStorage.getItem("hj_admin_logs") || "[]");
}
