
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
};

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
    </div>
  );
}
