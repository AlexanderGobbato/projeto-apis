"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import EditProjectModal from "./EditProjectModal";
import DeleteProjectButton from "./DeleteProjectButton";

interface Projeto {
  id: string;
  nome_projeto: string;
  server: string | null;
  url_base: string | null;
  git_url: string | null;
  anotacoes: string | null;
  _count: {
    recursos: number;
    scopes: number;
  };
  recursos: {
    publicado_prd: boolean;
  }[];
}

interface ProjectDashboardProps {
  projetos: Projeto[];
}

export default function ProjectDashboard({ projetos: initialProjetos }: ProjectDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProjetos = useMemo(() => {
    return initialProjetos.filter((p) =>
      p.nome_projeto.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialProjetos, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Controls: Search and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[24px] border border-[#e0e0e0] shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="relative flex-1 w-full">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5f6368]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Filtrar projetos pelo nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#f1f3f4] border-none rounded-full text-[#1f1f1f] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#f1f3f4] p-1 rounded-full border border-[#e0e0e0]">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              viewMode === "grid"
                ? "bg-white text-[#1a73e8] shadow-sm"
                : "text-[#5f6368] hover:bg-white/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Quadro
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              viewMode === "list"
                ? "bg-white text-[#1a73e8] shadow-sm"
                : "text-[#5f6368] hover:bg-white/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Listar
          </button>
        </div>
      </div>

      {filteredProjetos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border border-dashed border-[#e0e0e0] rounded-[32px] bg-white animate-in fade-in duration-700">
          <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#1f1f1f]">Nenhum correspondente encontrado</h3>
          <p className="text-[#70757a] mt-2 text-center max-w-xs text-sm">Altere seu filtro para encontrar o projeto que procura.</p>
        </div>
      ) : viewMode === "grid" ? (
        <ProjectGridView projetos={filteredProjetos} />
      ) : (
        <ProjectListView projetos={filteredProjetos} />
      )}
    </div>
  );
}

function ProjectGridView({ projetos }: { projetos: Projeto[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {projetos.map((projeto) => {
        const prdCount = projeto.recursos.filter((r) => r.publicado_prd).length;
        const total = projeto._count.recursos;
        const completion = total > 0 ? Math.round((prdCount / total) * 100) : 0;

        return (
          <div key={projeto.id} className="relative group card-md3 p-6 flex flex-col h-full bg-white">
            <div className="absolute top-4 right-4 z-20 flex gap-1">
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
        );
      })}
    </div>
  );
}

function ProjectListView({ projetos }: { projetos: Projeto[] }) {
  return (
    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-12 px-6 py-3 text-xs font-bold text-[#5f6368] uppercase tracking-wider">
        <div className="col-span-4">Projeto</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-3">Progresso PRD</div>
        <div className="col-span-2">Tags</div>
        <div className="col-span-1 text-right">Ações</div>
      </div>
      
      {projetos.map((projeto) => {
        const prdCount = projeto.recursos.filter((r) => r.publicado_prd).length;
        const total = projeto._count.recursos;
        const completion = total > 0 ? Math.round((prdCount / total) * 100) : 0;

        return (
          <div key={projeto.id} className="relative card-md3 bg-white p-4 hover:shadow-md transition-shadow">
             <div className="grid grid-cols-12 items-center">
                <div className="col-span-4 flex flex-col">
                   <Link href={`/dashboard/projetos/${projeto.id}`} className="text-base font-semibold text-[#1f1f1f] hover:text-[#1a73e8] transition-colors line-clamp-1">
                      {projeto.nome_projeto}
                   </Link>
                   <span className="text-[10px] text-[#70757a] font-mono">{projeto.server || "localhost"}</span>
                </div>

                <div className="col-span-2 flex justify-center">
                   <span className="text-[#34a853] font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 bg-[#e6f4ea] px-2 py-1 rounded-full border border-[#ceead6]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#34a853] animate-pulse"></div>
                      Ativo
                   </span>
                </div>

                <div className="col-span-3 flex items-center gap-3 pr-6">
                   <div className="flex-1 h-1.5 bg-[#f1f3f4] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1a73e8] transition-all duration-1000"
                        style={{ width: `${completion}%` }}
                      ></div>
                   </div>
                   <span className="text-[11px] font-bold text-[#1a73e8] w-8">{completion}%</span>
                </div>

                <div className="col-span-2 flex items-center gap-1">
                   <span className="text-[10px] bg-[#f1f3f4] text-[#444746] px-2 py-0.5 rounded-full border border-[#e0e0e0]">
                      {projeto._count.scopes} scopes
                   </span>
                   <span className="text-[10px] bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-full border border-[#d2e3fc]">
                      {total} res
                   </span>
                </div>

                <div className="col-span-1 flex justify-end gap-1">
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
             </div>
          </div>
        );
      })}
    </div>
  );
}
