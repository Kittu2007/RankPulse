
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Health",
  description: "Check API health",
};

export default function ApiHealthPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">API Health</h1>
    </div>
  );
}
