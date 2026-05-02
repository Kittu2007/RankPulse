import { useState } from "react";
import { Link, useLocation } from "wouter";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff, Chrome } from "lucide-react";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message === "Invalid login credentials"
        ? "Incorrect email or password."
        : error.message);
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`,
      },
    });
    if (error) {
      setMessage(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] px-4">
      <div className="border-2 border-[var(--black)] bg-white shadow-[6px_6px_0_var(--black)] w-full max-w-sm p-8 sm:p-10">
        <Link href="/" className="inline-flex items-center gap-0 mb-8">
          <div className="bg-[var(--red)] px-2 py-0.5">
            <div className="text-[18px] tracking-[2px] text-white font-black" style={{ fontFamily: "var(--font-d)" }}>RANKPULSE</div>
          </div>
        </Link>

        <div className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--red)] mb-1">Welcome Back</div>
        <div className="text-2xl font-black uppercase mb-6" style={{ fontFamily: "var(--font-d)" }}>LOGIN</div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 h-11 border-2 border-[var(--black)] bg-white font-bold text-sm hover:bg-[#f9f9f9] active:bg-[#f0f0f0] transition-colors mb-4 disabled:opacity-60"
        >
          {googleLoading ? (
            <span className="text-xs">Redirecting...</span>
          ) : (
            <>
              <Chrome className="h-4 w-4" />
              Continue with Google
            </>
          )}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#e5e5e5]" />
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-[#999]">or</span>
          <div className="flex-1 h-px bg-[#e5e5e5]" />
        </div>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[1px]">Email</label>
            <input
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input h-11 px-3 text-sm font-bold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[1px]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input h-11 px-3 pr-10 text-sm font-bold w-full"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[var(--black)]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {message && (
            <p className="text-sm font-bold text-[var(--red)] bg-[#fee2e2] border border-[var(--red)] px-3 py-2">{message}</p>
          )}

          <button type="submit" disabled={loading} className="btn btn-red w-full justify-center h-11 text-sm mt-1">
            {loading ? "Signing in..." : "Login"}
          </button>
          <Link href="/signup" className="btn btn-outline w-full justify-center h-11 text-sm">
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}
