import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("agent@example.com");
  const [password, setPassword] = useState("password");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await dispatch(login({ email, password }));
    if (login.fulfilled.match(res)) nav("/");
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", fontFamily: "system-ui" }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
        <button disabled={loading} type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>
    </div>
  );
}
