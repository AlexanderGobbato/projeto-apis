import { PrismaClient } from "@prisma/client";
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
      <div className="flex flex-col items-center justify-center p-16 border border-dashed border-gray-700/50 rounded-3xl bg-gray-800/20 backdrop-blur-sm">
        <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <h3 className="text-xl font-medium text-gray-300">Nenhum projeto cadastrado</h3>
        <p className="text-gray-500 mt-2 text-center max-w-sm">Comece criando seu primeiro projeto para rastrear suas APIs e ambientes.</p>
        <div className="mt-8">
          <CreateProjectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projetos.map((projeto) => {
        // Estatísticas do projeto
        const prdCount = projeto.recursos.filter(r => r.publicado_prd).length;
        const total = projeto._count.recursos;
        const completion = total > 0 ? Math.round((prdCount / total) * 100) : 0;

        return (
          <div key={projeto.id} className="relative group">
            {/* Botões de Ação Flutuantes */}
            <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

            <Link href={`/dashboard/projetos/${projeto.id}`} className="flex flex-col bg-gray-800/40 hover:bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1 overflow-hidden h-full">
               
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 text-blue-500 transform rotate-12 translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>

              <div className="relative z-10 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-semibold text-white tracking-tight pr-16">{projeto.nome_projeto}</h3>
                  <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full font-medium border border-blue-500/20">
                    {projeto._count.scopes} Scopes
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                  {projeto.anotacoes || "Sem descrição..."}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total APIs:</span>
                    <span className="text-gray-200 font-medium">{total}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Deploy PRD</span>
                      <span className="text-emerald-400">{completion}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-1000"
                        style={{ width: `${completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center group-hover:border-gray-600/50 transition-colors">
                <span className="text-blue-400 font-medium text-sm">Acessar Painel &rarr;</span>
                <span className="text-gray-500 text-xs">
                  {projeto.server || "Server N/A"}
                </span>
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">Projetos</h1>
          <p className="text-gray-400 mt-2">Gerencie governança, scopes e deployments de suas APIs.</p>
        </div>
        
        <CreateProjectButton />
      </div>

      <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-500">Carregando projetos...</div>}>
         <ProjectList />
      </Suspense>
    </div>
  );
}
