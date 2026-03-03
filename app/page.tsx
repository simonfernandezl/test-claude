"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp() {
    setMsg(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : "Registrado. Revisá tu email si pide confirmación.");
  }

  async function signIn() {
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : "Logueado.");
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h1>Supabase Auth Test</h1>

      {userEmail ? (
        <>
          <p>
            Logueado como: <b>{userEmail}</b>
          </p>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <>
          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginTop: 12, padding: 8 }}
          />
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginTop: 12, padding: 8 }}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={signUp}>Sign up</button>
            <button onClick={signIn}>Sign in</button>
          </div>
        </>
      )}

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  );
}
