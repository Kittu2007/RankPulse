"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
        data: {
          first_name: firstName,
          last_name: lastName,
          primary_platform: platformValue,
        }
      }
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const perks = [
    'Real-time SEO scoring for 3 platforms',
    'Penalty detection and fix guide',
    'Keyword research and hashtag intel',
    'Competitor analysis (1 competitor)',
    'Profile SEO audit',
    'AI content suggestions (5/day)'
  ];

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
            STOP<br />GUESSING.<br />START<br />RANKING.
          </div>
          <div className="body mb-28 text-[#555] max-w-[320px] text-sm">
            Join creators who optimise with real algorithm data, not blog post opinions.
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[2px] mb-3 text-[#555]">What you get — free:</div>
          {perks.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2 border-b border-[#222]">
              <span className="text-[var(--red)] font-bold text-[13px]">✓</span>
              <span className="text-xs font-bold text-[var(--bg)]">{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div className="max-w-[400px] w-full">
          <div className="text-[10px] font-bold uppercase tracking-[2px] mb-2 text-[var(--red)]">Get Started — It&apos;s Free</div>
          <div className="d3 mb-24 text-[48px] text-[var(--black)] leading-none" style={{ fontFamily: 'var(--font-d)' }}>CREATE<br />ACCOUNT.</div>
          <form onSubmit={handleSignup} className="auth-form flex flex-col gap-4">
            {error && <div className="text-red-500 text-sm font-bold mb-2">{error}</div>}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--black)]">First Name</label>
                <input 
                  className="input h-11 px-3 text-sm font-bold text-[var(--black)] border-2 border-[var(--black)] focus:border-[var(--red)] outline-none bg-white" 
                  placeholder="Kittu" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--black)]">Last Name</label>
                <input 
                  className="input h-11 px-3 text-sm font-bold text-[var(--black)] border-2 border-[var(--black)] focus:border-[var(--red)] outline-none bg-white" 
                  placeholder="Last name" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
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
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--black)]">Password</label>
              <input 
                className="input h-11 px-3 text-sm font-bold text-[var(--black)] border-2 border-[var(--black)] focus:border-[var(--red)] outline-none bg-white" 
                type="password" 
                placeholder="Min. 8 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--black)]">Primary Platform Focus</label>
              <select 
                className="input h-11 px-3 text-sm font-bold text-[var(--black)] border-2 border-[var(--black)] focus:border-[var(--red)] outline-none bg-white cursor-pointer"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option>Instagram</option>
                <option>LinkedIn</option>
                <option>X / Twitter</option>
                <option>All Three</option>
              </select>
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-red w-full flex justify-center font-bold text-xs uppercase tracking-wide h-12 mb-3">
               {isLoading ? "Creating Account..." : "Create Free Account →"}
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
              Already have an account?{' '}
              <Link href="/login" className="text-[var(--red)] font-bold">Sign in →</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
