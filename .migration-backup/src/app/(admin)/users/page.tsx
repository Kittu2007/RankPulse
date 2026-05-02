
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage users",
};

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
    </div>
  );
}
