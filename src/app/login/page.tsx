"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="mx-auto max-w-md space-y-3">
      <h1 className="text-2xl font-bold">Login</h1>
      <input className="w-full rounded border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded bg-brand py-2 text-white" onClick={() => signIn("credentials", { email, password, callbackUrl: "/" })}>Sign in</button>
      <button className="w-full rounded border py-2" onClick={() => signIn("google", { callbackUrl: "/" })}>Continue with Google</button>
    </div>
  );
}
