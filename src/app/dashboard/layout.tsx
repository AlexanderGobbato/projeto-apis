import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-white text-[#1f1f1f] overflow-hidden font-sans">
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col relative overflow-y-auto bg-[#f8f9fa]">
        <main className="flex-1 p-8 lg:p-12 relative z-10">{children}</main>
      </div>
    </div>
  );
}
