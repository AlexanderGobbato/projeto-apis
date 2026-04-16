import { PrismaClient } from "@prisma/client";
export const dynamic = 'force-dynamic';
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/auth";

async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return (
      <div className="text-gray-500 text-center py-12">
        Digite um termo para pesquisar nos Paths, Requests e Responses armazenados.
      </div>
    );
  }

  // Busca profunda com ILIKE (contains com mode: 'insensitive' no PostgreSQL via Prisma)
  // Requisito atendido: "O sistema deve encontrar termos específicos dentro das strings JSON armazenadas"
  const resultados = await prisma.recurso.findMany({
    where: {
      OR: [
        { path: { contains: query, mode: "insensitive" } },
        { procedure_transacao: { contains: query, mode: "insensitive" } },
        { request: { contains: query, mode: "insensitive" } },
        { response: { contains: query, mode: "insensitive" } },
        { anotacoes: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      projeto: true,
    },
    take: 50, // Limitando resultados
  });

  if (resultados.length === 0) {
    return <div className="text-gray-500 py-8">Nenhum endpoint encontrado para "{query}".</div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400 mb-6">{resultados.length} resultados encontrados.</p>
      {resultados.map((recurso) => (
        <div key={recurso.id} className="card-md3 p-6 bg-white overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                recurso.metodo === 'GET' ? 'bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]' : 
                recurso.metodo === 'POST' ? 'bg-[#e6f4ea] text-[#1e8e3e] border-[#ceead6]' : 
                recurso.metodo === 'PUT' ? 'bg-[#fef7e0] text-[#f4b400] border-[#fce8b2]' : 
                recurso.metodo === 'DELETE' ? 'bg-[#fde8e8] text-[#d93025] border-[#fad2cf]' : 
                'bg-[#f1f3f4] text-[#5f6368] border-[#e0e0e0]'
              }`}>
                {recurso.metodo}
              </span>
              <span className="text-lg text-[#1f1f1f] font-mono font-medium">{recurso.path}</span>
              {recurso.procedure_transacao && (
                <span className="text-[10px] text-[#1a73e8] font-bold uppercase bg-[#e8f0fe] px-2 py-0.5 rounded border border-[#d2e3fc]">PROC/TRANS: {recurso.procedure_transacao}</span>
              )}
            </div>
            <Link href={`/dashboard/projetos/${recurso.projeto_id}`} className="text-sm font-bold text-[#1a73e8] hover:underline transition">
              Acessar Projeto: {recurso.projeto.nome_projeto} &rarr;
            </Link>
          </div>
          
          <div className="flex gap-2 mt-4 text-[10px] font-bold">
            <div className={`px-2.5 py-1 rounded-full border ${recurso.publicado_dev ? 'bg-[#e8f0fe] text-[#1a73e8] border-[#1a73e8]' : 'bg-gray-100 text-gray-300 border-transparent'}`}>DEV</div>
            <div className={`px-2.5 py-1 rounded-full border ${recurso.publicado_hml ? 'bg-[#fef7e0] text-[#f4b400] border-[#f4b400]' : 'bg-gray-100 text-gray-300 border-transparent'}`}>HML</div>
            <div className={`px-2.5 py-1 rounded-full border ${recurso.publicado_prd ? 'bg-[#e6f4ea] text-[#1e8e3e] border-[#1e8e3e]' : 'bg-gray-100 text-gray-300 border-transparent'}`}>PRD</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Em vez de importar searchparams como prop dinâmico, na versão mais recente do nextjs o searchParams é uma promise:
export default async function GlobalSearchPage(props: { searchParams?: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-[#1f1f1f] tracking-tight">Rastreio Global de APIs</h1>
        <p className="text-[#5f6368] mt-2 text-base">Busque por rotas, fragmentos JSON de request/response e documentações entre todos os projetos.</p>
      </div>

      <div className="bg-white border border-[#e0e0e0] rounded-[24px] p-6 shadow-sm">
        <form className="flex gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              name="q"
              defaultValue={q}
              className="w-full pl-12 pr-4 py-4 bg-[#f1f3f4] border-b-2 border-[#1a73e8] rounded-t-xl text-[#1f1f1f] focus:outline-none focus:bg-[#e8f0fe] transition-all" 
              placeholder='Buscar em JSON (... "idUsuario": 123 ...)' 
            />
          </div>
          <button type="submit" className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white font-bold px-10 py-4 rounded-full transition shadow-md">
            Buscar
          </button>
        </form>
      </div>


      <Suspense key={q} fallback={<div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        <SearchResults query={q} />
      </Suspense>
    </div>
  );
}
