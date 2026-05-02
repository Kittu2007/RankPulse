
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hashtags",
  description: "Discover new hashtags",
};

export default function HashtagsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Hashtags</h1>
    </div>
  );
}
