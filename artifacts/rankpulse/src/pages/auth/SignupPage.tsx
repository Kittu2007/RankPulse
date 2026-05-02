import { useState } from "react";
import { Link, useLocation } from "wouter";
import { createClient } from "@/utils/supabase/client";
import { Check, Chrome } from "lucide-react";

export default function SignupPage() {
  const [, navigate] = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    let platformValue = platform.toLowerCase();
    if (platformValue.includes("x / twitter")) platformValue = "x";
    if (platformValue.includes("all three")) platformValue = "all";
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, primary_platform: platformValue },
        emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  const perks = [
    "Real-time SEO scoring for 3 platforms",
    "Penalty detection and fix guide",
    "Keyword research and hashtag intel",
    "Competitor analysis (1 competitor)",
    "Profile SEO audit",
    "AI content suggestions (5/day)",
  ];

  return (
    <div className="auth-page bg-[var(--bg)] min-h-screen">
      {/* Left panel */}
      <div className="auth-left">
        <div>
          <Link href="/" className="inline-flex items-center gap-0 mb-10">
            <div className="bg-[var(--red)] px-2.5 py-1">
              <div className="text-[22px] tracking-[3px] text-[var(--bg)] font-black" style={{ fontFamily: "var(--font-d)" }}>RANKPULSE</div>
            </div>
          </Link>
          <div className="d2 mb-12 text-[var(--bg)] leading-none text-[clamp(36px,5vw,64px)]" style={{ fontFamily: "var(--font-d)" }}>
            STOP<br />GUESSING.<br />START<br />RANKING.
          </div>
          <div className="body mb-8 text-[#888] max-w-[320px] text-sm">
            Join creators who optimise with real algorithm data, not blog post opinions.
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[2px] mb-3 text-[#666]">What you get — free:</div>
          {perks.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2 border-b border-[#222]">
              <Check className="text-[var(--red)] h-3.5 w-3.5 shrink-0" />
              <span className="text-xs font-bold text-[var(--bg)]">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="max-w-[400px] w-full">
          <div className="text-[10px] font-bold uppercase tracking-[2px] mb-2 text-[var(--red)]">Get Started — It&apos;s Free</div>
          <div className="d3 mb-6 text-[clamp(32px,4vw,48px)] text-[var(--black)] leading-none" style={{ fontFamily: "var(--font-d)" }}>CREATE<br />ACCOUNT.</div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 h-11 border-2 border-[var(--black)] bg-white font-bold text-sm hover:bg-[#f9f9f9] active:bg-[#f0f0f0] transition-colors mb-4 disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="text-xs">Redirecting...</span>
            ) : (
              <>
                <Chrome className="h-4 w-4" />
                Sign up with Google
              </>
            )}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#d0d0d0]" />
            <span className="text-[10px] font-bold uppercase tracking-[1px] text-[#999]">or fill in below</span>
            <div className="flex-1 h-px bg-[#d0d0d0]" />
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {error && <div className="text-[var(--red)] text-sm font-bold bg-[#fee2e2] border border-[var(--red)] px-3 py-2">{error}</div>}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[1px]">First Name</label>
                <input className="input h-11 px-3 text-sm font-bold" placeholder="Kittu" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[1px]">Last Name</label>
                <input className="input h-11 px-3 text-sm font-bold" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[1px]">Email Address</label>
              <input className="input h-11 px-3 text-sm font-bold" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[1px]">Password</label>
              <input className="input h-11 px-3 text-sm font-bold" type="password" placeholder="Min. 8 characters" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5 mb-2">
              <label className="text-[10px] font-bold uppercase tracking-[1px]">Primary Platform Focus</label>
              <select className="input h-11 px-3 text-sm font-bold cursor-pointer" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option>Instagram</option>
                <option>LinkedIn</option>
                <option>X / Twitter</option>
                <option>All Three</option>
              </select>
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-red w-full justify-center h-12 text-sm">
              {isLoading ? "Creating Account..." : "Create Free Account"}
            </button>
            <div className="text-center text-xs font-bold text-[#555]">
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--red)] font-bold">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
