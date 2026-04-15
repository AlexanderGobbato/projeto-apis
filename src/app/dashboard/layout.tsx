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
    <div className="flex h-screen bg-[#0B0F19] text-gray-100 overflow-hidden font-sans">
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Fundo Glow Decorativo */}
        <div className="fixed -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>
        <div className="fixed top-[40%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>

        <main className="flex-1 p-8 lg:p-12 relative z-10">{children}</main>
      </div>
    </div>
  );
}
