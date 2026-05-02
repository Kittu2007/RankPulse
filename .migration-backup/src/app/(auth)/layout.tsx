import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | RankPulse",
  description: "Sign in or create your RankPulse account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
