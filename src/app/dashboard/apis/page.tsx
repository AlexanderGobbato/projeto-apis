import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";

const prisma = new PrismaClient();

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
        <div key={recurso.id} className="bg-gray-800/40 border border-gray-700/50 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 text-xs font-bold rounded
                ${recurso.metodo === 'GET' ? 'bg-blue-500/20 text-blue-400' : 
                  recurso.metodo === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 
                  recurso.metodo === 'PUT' ? 'bg-amber-500/20 text-amber-400' : 
                  recurso.metodo === 'DELETE' ? 'bg-red-500/20 text-red-400' : 
                  'bg-gray-500/20 text-gray-400'}`
              }>
                {recurso.metodo}
              </span>
              <span className="text-lg text-white font-mono">{recurso.path}</span>
            </div>
            <Link href={`/dashboard/projetos/${recurso.projeto_id}`} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition">
              Acessar Projeto: {recurso.projeto.nome_projeto} &rarr;
            </Link>
          </div>
          
          <div className="flex gap-2 mt-4 text-xs font-medium">
            <div className={`px-2 py-1 rounded-md border ${recurso.publicado_dev ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-800/50 text-gray-600 border-transparent'}`}>DEV</div>
            <div className={`px-2 py-1 rounded-md border ${recurso.publicado_hml ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-gray-800/50 text-gray-600 border-transparent'}`}>HML</div>
            <div className={`px-2 py-1 rounded-md border ${recurso.publicado_prd ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-800/50 text-gray-600 border-transparent'}`}>PRD</div>
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">Rastreio Global de APIs</h1>
        <p className="text-gray-400 mt-2">Busque por rotas, fragmentos JSON de request/response e documentações entre todos os projetos.</p>
      </div>

      <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6 shadow-lg backdrop-blur-xl">
        <form className="flex gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              name="q"
              defaultValue={q}
              className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" 
              placeholder='Buscar em JSON (... "idUsuario": 123 ...)' 
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-4 rounded-xl transition shadow-lg shadow-blue-500/20">
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
