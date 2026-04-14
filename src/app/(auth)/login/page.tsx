"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="auth-page bg-[var(--bg)] min-h-screen">
      <div className="auth-left">
        <div>
          <Link href="/" className="inline-flex items-center gap-0 mb-10">
            <div className="bg-[var(--red)] px-2.5 py-1">
              <div className="text-[22px] tracking-[3px] text-[var(--bg)]" style={{ fontFamily: 'var(--font-d)' }}>
                RANKPULSE
              </div>
            </div>
          </Link>
          <div className="d2 mb-16 text-[var(--bg)] leading-none text-[64px]" style={{ fontFamily: 'var(--font-d)' }}>
            GOOD TO<br />HAVE YOU<br />BACK.
          </div>
          <div className="body text-[#555] max-w-[320px] text-sm">
            Your SEO scores, penalty feeds, and keyword data — all waiting for you.
          </div>
        </div>
        <div>
          {[
            { num: '82', label: 'Your Instagram SEO Score' },
            { num: '3', label: 'Penalties to fix today' },
            { num: '+18%', label: 'Reach growth this week' },
          ].map((s, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-[#222]">
              <span className="text-xs font-bold text-[#555]">{s.label}</span>
              <span className="text-[22px] text-[var(--red)] leading-none" style={{ fontFamily: 'var(--font-d)' }}>
                {s.num}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div className="max-w-[400px] w-full">
          <div className="text-[10px] font-bold uppercase tracking-[2px] mb-2 text-[var(--red)]">Welcome Back</div>
          <div className="d3 mb-24 text-[48px] text-[var(--black)] leading-none" style={{ fontFamily: 'var(--font-d)' }}>SIGN IN.</div>
          <form onSubmit={handleLogin} className="auth-form flex flex-col gap-4">
            {error && <div className="text-red-500 text-sm font-bold mb-2">{error}</div>}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--black)]">Email Address</label>
              <input 
                className="input h-11 px-3 text-sm font-bold text-[var(--black)] border-2 border-[var(--black)] focus:border-[var(--red)] outline-none bg-white" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--black)]">Password</label>
              <input 
                className="input h-11 px-3 text-sm font-bold text-[var(--black)] border-2 border-[var(--black)] focus:border-[var(--red)] outline-none bg-white" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-red w-full flex justify-center font-bold text-xs uppercase tracking-wide h-12 mb-3">
              {isLoading ? "Signing In..." : "Sign In →"}
            </button>
            
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-[#eaeaea]"></div>
              <div className="text-[10px] font-bold uppercase text-[#888] tracking-widest">or</div>
              <div className="flex-1 h-px bg-[#eaeaea]"></div>
            </div>
            
            <button className="btn btn-outline w-full flex justify-center bg-white font-bold text-xs uppercase tracking-wide h-12 mb-4">
              Continue with Google
            </button>
            <div className="text-center text-xs font-bold text-[#555]">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[var(--red)] font-bold">Sign up free →</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
