"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TopNav() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="font-bold text-lg">
        RankPulse
      </Link>
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/#features">Features</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/#pricing">Pricing</Link>
        </Button>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </nav>
  );
}
