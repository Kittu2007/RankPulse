
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitors",
  description: "Track your competitors",
};

export default function CompetitorsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Competitors</h1>
    </div>
  );
}
