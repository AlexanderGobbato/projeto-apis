import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black">
      {/* Elementos decorativos (Glassmorphism blobs) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[800px] bg-gradient-to-tr from-transparent via-blue-900/10 to-transparent border border-white/5 rounded-[4rem] pointer-events-none transform rotate-12"></div>

      {/* Container Principal do Formulário */}
      <div className="relative z-10 w-full flex justify-center px-4">
        <LoginForm />
      </div>
    </main>
  );
}
