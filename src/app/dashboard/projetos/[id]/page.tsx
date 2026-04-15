import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createScopeAction, createRecursoAction, toggleAmbienteAction } from "@/lib/actions/resource-actions";

const prisma = new PrismaClient();

// Usando o pattern oficial no Next.js 15: props.params é uma Promise.
export default async function ProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const projeto = await prisma.projeto.findUnique({
    where: { id: params.id },
    include: {
      scopes: true,
      recursos: {
        orderBy: { path: "asc" }
      }
    }
  });

  if (!projeto) return notFound();

  // Bind server actions
  const createScope = createScopeAction.bind(null, projeto.id);
  const createRecurso = createRecursoAction.bind(null, projeto.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Breadcrumb */}
      <div className="flex gap-2 text-sm font-medium text-gray-500 mb-2">
        <Link href="/dashboard" className="hover:text-white transition">Projetos</Link>
        <span>/</span>
        <span className="text-white">{projeto.nome_projeto}</span>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/20 border border-blue-800/30 p-8 rounded-3xl backdrop-blur-md shadow-xl flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-3">{projeto.nome_projeto}</h1>
          <p className="text-gray-300 max-w-2xl">{projeto.anotacoes || "Nenhuma descrição informada."}</p>
          <div className="flex gap-4 mt-6 text-sm text-gray-400">
             <span className="bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-700/50">🏠 {projeto.url_base || "URL Não definida"}</span>
             <span className="bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-700/50">🌐 {projeto.server || "Servidor não definido"}</span>
             <a href={projeto.git_url || "#"} className="bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-700/50 hover:text-white transition cursor-pointer">📦 Git Repo</a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Lado Esquerdo: Scopes e Add Forms */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Card: Adicionar Scope */}
          <div className="bg-gray-800/40 border border-gray-700/80 p-6 rounded-2xl">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">🔗 Scopes do Projeto</h3>
             <form action={createScope} className="flex gap-2 mb-6">
               <input name="identificador_scope" placeholder="user:read" className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
               <button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-3 py-2 text-sm transition">+</button>
             </form>
             
             <ul className="space-y-2">
               {projeto.scopes.map(scope => (
                 <li key={scope.id} className="text-sm text-gray-300 bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-700/30 flex justify-between">
                   <span className="font-mono">{scope.identificador_scope}</span>
                 </li>
               ))}
               {projeto.scopes.length === 0 && <li className="text-xs text-gray-500">Nenhum scope cadastrado.</li>}
             </ul>
          </div>

        </div>

        {/* Lado Direito: Lista de Endpoints */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-gray-800/40 border border-gray-700/80 p-6 rounded-2xl flex flex-col h-full">
            <h3 className="text-xl font-bold text-white mb-6">Recursos (Endpoints)</h3>
            
            {/* Tabela Interativa */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700/60 text-sm text-gray-400">
                    <th className="pb-3 px-4 font-medium">Método</th>
                    <th className="pb-3 px-4 font-medium">Path</th>
                    <th className="pb-3 px-4 font-medium text-center">DEV</th>
                    <th className="pb-3 px-4 font-medium text-center">HML</th>
                    <th className="pb-3 px-4 font-medium text-center">PRD</th>
                  </tr>
                </thead>
                <tbody>
                  {projeto.recursos.map(rec => (
                    <tr key={rec.id} className="border-b border-gray-800/80 hover:bg-gray-700/10 transition-colors group">
                      <td className="py-4 px-4 font-bold text-xs font-mono">
                        <span className={`px-2 py-1 rounded
                          ${rec.metodo === 'GET' ? 'bg-blue-500/20 text-blue-400' : 
                            rec.metodo === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`
                        }>{rec.metodo}</span>
                      </td>
                      <td className="py-4 px-4 font-mono text-sm text-gray-200">{rec.path}</td>
                      <td className="py-4 px-4 text-center">
                        <form action={toggleAmbienteAction.bind(null, rec.id, projeto.id, 'dev', rec.publicado_dev)}>
                          <button type="submit" className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors ${rec.publicado_dev ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-gray-900 border border-gray-700 text-transparent'}`}>✓</button>
                        </form>
                      </td>
                      <td className="py-4 px-4 text-center">
                         <form action={toggleAmbienteAction.bind(null, rec.id, projeto.id, 'hml', rec.publicado_hml)}>
                          <button type="submit" className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors ${rec.publicado_hml ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-gray-900 border border-gray-700 text-transparent'}`}>✓</button>
                        </form>
                      </td>
                      <td className="py-4 px-4 text-center">
                         <form action={toggleAmbienteAction.bind(null, rec.id, projeto.id, 'prd', rec.publicado_prd)}>
                          <button type="submit" className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors ${rec.publicado_prd ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-gray-900 border border-gray-700 text-transparent'}`}>✓</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {projeto.recursos.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">Nenhum endpoint adicionado. Use o formulário abaixo.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Formulario de Novo Endpoint Rápido */}
            <div className="mt-8 pt-6 border-t border-gray-700/60">
              <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2"><svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg> Novo Endpoint</h4>
              <form action={createRecurso} className="grid grid-cols-12 gap-3 bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                <div className="col-span-3">
                  <select name="metodo" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-blue-500">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
                <div className="col-span-9">
                  <input name="path" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-blue-500" placeholder="/api/v1/resource/:id" />
                </div>
                <div className="col-span-12 flex gap-4 mt-2">
                  <div className="flex-1">
                    <textarea name="request" rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300 font-mono resize-none focus:ring-blue-500" placeholder="Exemplo de Request (JSON)..."></textarea>
                  </div>
                  <div className="flex-1">
                    <textarea name="response" rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300 font-mono resize-none focus:ring-blue-500" placeholder="Exemplo de Response (JSON)..."></textarea>
                  </div>
                </div>
                <div className="col-span-12 flex items-center justify-between mt-2">
                  <div className="flex gap-4 text-sm text-gray-400">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="dev" className="rounded" /> DEV</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="hml" className="rounded" /> HML</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="prd" className="rounded" /> PRD</label>
                  </div>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2 rounded-lg transition">Adicionar Endpoint</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
