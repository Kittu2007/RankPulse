import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav variant="public" />
      <main>{children}</main>
      <Footer />
    </>
  );
}
