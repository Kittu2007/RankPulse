import { useEffect } from "react";
import { useLocation } from "wouter";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)]">
      <div className="text-center">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--red)] mb-2">Please wait</div>
        <div className="text-2xl font-black uppercase" style={{ fontFamily: "var(--font-d)" }}>Signing you in...</div>
      </div>
    </div>
  );
}
