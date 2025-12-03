import type { Session, User } from "./types";

interface StoredUser {
  id: string;
  email: string;
  password: string;
}

const USERS_KEY = "mock_users";
const SESSION_KEY = "mock_session";
const DEMO_USER_ID = "demo-user-001";

const generateId = () => Math.random().toString(36).substring(2, 15);

// Initialize with demo user
function initializeDemoUser(): void {
  const users = getStoredUsers();

  // Only initialize if no users exist
  if (users.length === 0) {
    const demoUser: StoredUser = {
      id: DEMO_USER_ID,
      email: "demo@example.com",
      password: "demo123",
    };

    saveUsers([demoUser]);
  }
}

function getStoredUsers(): StoredUser[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getStoredSession(): Session | null {
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

function saveSession(session: Session | null): void {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// Initialize demo user on module load
initializeDemoUser();

export function getCurrentUser(): User | null {
  const session = getStoredSession();
  return session?.user ?? null;
}

export function getCurrentSession(): Session | null {
  return getStoredSession();
}

export function getDemoUserId(): string {
  return DEMO_USER_ID;
}

export function signUp(
  email: string,
  password: string
): { error: string | null } {
  const users = getStoredUsers();

  if (users.some((u) => u.email === email)) {
    return { error: "User already registered" };
  }

  const newUser: StoredUser = {
    id: generateId(),
    email,
    password,
  };

  users.push(newUser);
  saveUsers(users);

  // Auto-login
  const session: Session = {
    user: { id: newUser.id, email: newUser.email },
    access_token: generateId(),
  };
  saveSession(session);

  return { error: null };
}

export function signIn(
  email: string,
  password: string
): { error: string | null } {
  const users = getStoredUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { error: "Invalid login credentials" };
  }

  const session: Session = {
    user: { id: user.id, email: user.email },
    access_token: generateId(),
  };
  saveSession(session);

  return { error: null };
}

export function signOut(): void {
  saveSession(null);
}
