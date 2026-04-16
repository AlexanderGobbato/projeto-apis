export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import CreateProjectButton from "@/components/CreateProjectButton";
import { prisma } from "@/auth";
import ProjectDashboard from "@/components/ProjectDashboard";

async function ProjectList() {
  const projetos = await prisma.projeto.findMany({
    include: {
      _count: {
        select: { recursos: true, scopes: true },
      },
      recursos: {
        select: {
          publicado_prd: true,
        }
      }
    },
    orderBy: { criadoEm: "desc" }
  });

  return <ProjectDashboard projetos={projetos as any} />;
}

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#1f1f1f] tracking-tight">Painel de Projetos</h1>
          <p className="text-[#70757a] mt-1 text-base">Visualize e gerencie a governança das suas APIs e recursos técnicos.</p>
        </div>
        
        <div className="flex-shrink-0">
          <CreateProjectButton />
        </div>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-56 bg-white animate-pulse rounded-[20px] border border-[#e0e0e0]"></div>)}
        </div>
      }>
         <ProjectList />
      </Suspense>
    </div>
  );
}
