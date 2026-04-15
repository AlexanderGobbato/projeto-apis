import Link from "next/link";
export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import CreateProjectButton from "@/components/CreateProjectButton";
import EditProjectModal from "@/components/EditProjectModal";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import { prisma } from "@/auth";

async function ProjectList() {
  const projetos = await prisma.projeto.findMany({
    include: {
      _count: {
        select: { recursos: true, scopes: true },
      },
      recursos: {
        select: {
          publicado_dev: true,
          publicado_hml: true,
          publicado_prd: true,
        }
      }
    },
    orderBy: { criadoEm: "desc" }
  });

  if (projetos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border border-dashed border-[#e0e0e0] rounded-[32px] bg-white">
        <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#1f1f1f]">Nenhum projeto ainda</h3>
        <p className="text-[#70757a] mt-2 text-center max-w-xs text-sm">Crie seu primeiro projeto para começar a gerenciar suas APIs com governança.</p>
        <div className="mt-8">
          <CreateProjectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projetos.map((projeto) => {
        const prdCount = projeto.recursos.filter(r => r.publicado_prd).length;
        const total = projeto._count.recursos;
        const completion = total > 0 ? Math.round((prdCount / total) * 100) : 0;

        return (
          <div key={projeto.id} className="relative group card-md3 p-6 flex flex-col h-full bg-white">
            {/* Ações Flutuantes MD3 */}
            <div className="absolute top-4 right-4 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <EditProjectModal projeto={{
                id: projeto.id,
                nome_projeto: projeto.nome_projeto,
                server: projeto.server,
                url_base: projeto.url_base,
                git_url: projeto.git_url,
                anotacoes: projeto.anotacoes
              }} />
              <DeleteProjectButton projectId={projeto.id} projectName={projeto.nome_projeto} />
            </div>

            <Link href={`/dashboard/projetos/${projeto.id}`} className="flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-[#1f1f1f] pr-12 line-clamp-1">{projeto.nome_projeto}</h3>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                 <span className="text-[11px] bg-[#f1f3f4] text-[#444746] px-2 py-0.5 rounded-full border border-[#e0e0e0]">
                  {projeto._count.scopes} scopes
                </span>
                <span className="text-[11px] bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-full border border-[#d2e3fc]">
                  {total} recursos
                </span>
              </div>

              <p className="text-[#70757a] text-sm mb-6 line-clamp-3 flex-1">
                {projeto.anotacoes || "Nenhuma descrição disponível para este projeto."}
              </p>

              <div className="space-y-3 pt-4 border-t border-[#f1f3f4]">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]"></div>
                      <span className="text-xs font-medium text-[#444746]">Deploy Progress</span>
                   </div>
                   <span className="text-xs font-bold text-[#1a73e8]">{completion}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#f1f3f4] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1a73e8] transition-all duration-1000"
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                   <span className="text-[#34a853] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      PRD Status
                   </span>
                   <span className="text-[10px] text-gray-400 font-mono">
                      {projeto.server || "localhost"}
                   </span>
                </div>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  );
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
