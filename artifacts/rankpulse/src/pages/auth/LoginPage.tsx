import { useState } from "react";
import { Link, useLocation } from "wouter";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("Could not authenticate user");
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)]">
      <div className="border-2 border-[var(--black)] p-10 bg-white shadow-[6px_6px_0_var(--black)] w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-0 mb-8">
          <div className="bg-[var(--red)] px-2 py-0.5">
            <div className="text-[18px] tracking-[2px] text-white font-black" style={{ fontFamily: "var(--font-d)" }}>RANKPULSE</div>
          </div>
        </Link>
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--red)] mb-2">Welcome Back</div>
        <div className="text-2xl font-black uppercase mb-6" style={{ fontFamily: 'var(--font-d)' }}>LOGIN</div>
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[1px]">Email</label>
            <input type="email" placeholder="m@example.com" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input h-11 px-3 text-sm font-bold" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[1px]">Password</label>
            <input type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input h-11 px-3 text-sm font-bold" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-red w-full justify-center h-11 text-sm">
            {loading ? "Signing in..." : "Login →"}
          </button>
          <Link href="/signup" className="btn btn-outline w-full justify-center h-11 text-sm">
            Create Account
          </Link>
          {message && <p className="text-sm font-bold text-[var(--red)] text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}
