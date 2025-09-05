import { useState } from "react";
import { login, signup } from "../utils/api";

export default function AuthForm({ type = "login", onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = type === "login" ? await login(username, password) : await signup(username, password);
      localStorage.setItem("token", res.token);
      setMsg("Success!");
      onAuth && onAuth(res);
    } catch (err) {
      setMsg("Error! " + (err.response?.data || err.message));
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" required />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required minLength={3} />
      <button type="submit">{type === "login" ? "Login" : "Signup"}</button>
      <div>{msg}</div>
    </form>
  );
}
