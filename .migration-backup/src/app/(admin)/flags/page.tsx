
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feature Flags",
  description: "Manage feature flags",
};

export default function FlagsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Feature Flags</h1>
    </div>
  );
}
