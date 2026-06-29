const AUTH_KEY = 'tarot_admin_auth';
// Default admin credentials (change via localStorage key 'tarot_admin_password' if desired)
const DEFAULT_PASSWORD = 'admin123';

export function login(email: string, password: string): boolean {
  const storedPassword = localStorage.getItem('tarot_admin_password') || DEFAULT_PASSWORD;
  if (password === storedPassword) {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({ email, loggedIn: true }));
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn(): boolean {
  try {
    const data = sessionStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data).loggedIn === true : false;
  } catch { return false; }
}

export function getCurrentUser(): { email: string } | null {
  try {
    const data = sessionStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}
