import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { Mail, ArrowRight } from "lucide-react";

export default function EmailVerificationPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rp_verify_email");
    if (savedEmail) setEmail(savedEmail);
    else if (user?.email) setEmail(user.email);
  }, [user]);

  const handleResend = async () => {
    if (!auth.currentUser) {
      setError("No user signed in. Please log in again.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await sendEmailVerification(auth.currentUser);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    }
    setSending(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] px-4">
      <div className="border-2 border-[var(--black)] bg-white shadow-[6px_6px_0_var(--black)] w-full max-w-sm p-8 sm:p-10 text-center">
        <Link href="/" className="inline-flex items-center gap-0 mb-8 mx-auto">
          <div className="bg-[var(--red)] px-2 py-0.5">
            <div className="text-[18px] tracking-[2px] text-white font-black" style={{ fontFamily: "var(--font-d)" }}>RANKPULSE</div>
          </div>
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#fee2e2] rounded-full flex items-center justify-center border-2 border-[var(--red)]">
            <Mail className="h-8 w-8 text-[var(--red)]" />
          </div>
        </div>

        <div className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--red)] mb-1">Almost there</div>
        <div className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-d)" }}>CHECK YOUR INBOX</div>
        
        <p className="text-sm font-bold text-[#555] mb-6 leading-relaxed">
          We sent a verification link to<br/>
          <span className="text-[var(--black)] bg-[var(--bg)] px-1 py-0.5">{email || "your email"}</span>.<br/>
          Click it to activate your account.
        </p>

        {error && <div className="text-[var(--red)] text-sm font-bold bg-[#fee2e2] border border-[var(--red)] px-3 py-2 mb-4">{error}</div>}
        {sent && <div className="text-green-700 text-sm font-bold bg-green-50 border border-green-600 px-3 py-2 mb-4">Verification email sent!</div>}

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleResend} 
            disabled={sending || sent} 
            className="btn btn-outline w-full justify-center h-11 text-sm"
          >
            {sending ? "Sending..." : sent ? "Email Sent" : "Resend Email"}
          </button>

          <Link href="/dashboard" className="btn btn-red w-full justify-center h-11 text-sm flex items-center gap-2">
            Continue to Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 text-center text-xs font-bold text-[#555]">
          Wrong email?{" "}
          <Link href="/signup" className="text-[var(--red)] font-bold">Sign up again</Link>
        </div>
      </div>
    </div>
  );
}
