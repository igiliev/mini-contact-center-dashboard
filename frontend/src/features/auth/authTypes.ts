export type User = { id: number; name: string; email: string };

export type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
};
