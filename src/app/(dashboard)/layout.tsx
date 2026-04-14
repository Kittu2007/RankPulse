import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav variant="dashboard" />
      <div className="flex" style={{ minHeight: "calc(100vh - 52px)" }}>
        <Sidebar />
        <main className="flex-1 overflow-auto bg-[var(--bg)]">
          {children}
        </main>
      </div>
    </>
  );
}
