const BASE = "/api";

export interface User {
  id: number;
  name: string;
  createdAt: string;
}

export interface Beigne {
  id: number;
  userId: number;
  user: User;
  caughtAt: string;
  cost: number | null;
  createdAt: string;
}

export interface ScoreboardEntry {
  id: number;
  name: string;
  timesCaught: number;
  totalSpent: number;
}

export const queryKeys = {
  users: ["users"] as const,
  beignes: ["beignes"] as const,
  scoreboard: ["scoreboard"] as const,
};

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${BASE}/users`);
  return res.json();
}

export async function createUser(name: string): Promise<User> {
  const res = await fetch(`${BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function catchUser(userId: number): Promise<Beigne> {
  const res = await fetch(`${BASE}/beignes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

export async function fetchBeignes(): Promise<Beigne[]> {
  const res = await fetch(`${BASE}/beignes`);
  return res.json();
}

export async function updateBeigneCost(
  id: number,
  cost: number
): Promise<Beigne> {
  const res = await fetch(`${BASE}/beignes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cost }),
  });
  return res.json();
}

export async function fetchScoreboard(): Promise<ScoreboardEntry[]> {
  const res = await fetch(`${BASE}/scoreboard`);
  return res.json();
}

export async function deleteBeigne(id: number): Promise<void> {
  await fetch(`${BASE}/beignes/${id}`, { method: "DELETE" });
}

export async function deleteUser(id: number): Promise<void> {
  await fetch(`${BASE}/users/${id}`, { method: "DELETE" });
}
