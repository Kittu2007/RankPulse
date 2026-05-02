
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scheduler",
  description: "Schedule your posts",
};

export default function SchedulerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Scheduler</h1>
    </div>
  );
}
