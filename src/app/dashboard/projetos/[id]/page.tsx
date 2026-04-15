import { notFound } from "next/navigation";
import Link from "next/link";
import { createScopeAction, createRecursoAction, toggleAmbienteAction, deleteRecursoAction } from "@/lib/actions/resource-actions";
import { prisma } from "@/auth";
import EditResourceModal from "@/components/EditResourceModal";
import DeleteResourceButton from "@/components/DeleteResourceButton";
import EditScopeModal from "@/components/EditScopeModal";
import DeleteScopeButton from "@/components/DeleteScopeButton";

export const dynamic = 'force-dynamic';

function formatJson(data: string | null) {
  if (!data) return null;
  try {
    const obj = JSON.parse(data);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return data;
  }
}

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

  const createScope = createScopeAction.bind(null, projeto.id);
  const createRecurso = createRecursoAction.bind(null, projeto.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      <div className="flex gap-2 text-sm font-medium text-[#70757a] mb-4">
        <Link href="/dashboard" className="hover:text-[#1a73e8] transition">Projetos</Link>
        <span>/</span>
        <span className="text-[#1f1f1f]">{projeto.nome_projeto}</span>
      </div>

      <div className="bg-white border border-[#e0e0e0] p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#1f1f1f]">{projeto.nome_projeto}</h1>
            <span className="bg-[#e8f0fe] text-[#1a73e8] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{projeto.server || "PRODUÇÃO"}</span>
          </div>
          <p className="text-[#5f6368] max-w-2xl text-sm leading-relaxed">{projeto.anotacoes || "Nenhuma descrição técnica informada para este projeto."}</p>
          <div className="flex flex-wrap gap-3 mt-6">
             <span className="bg-[#f8f9fa] px-4 py-2 rounded-full border border-[#e0e0e0] text-xs text-[#444746] font-medium flex items-center gap-2">
               <svg className="w-4 h-4 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
               {projeto.url_base || "URL Base não definida"}
             </span>
             <a href={projeto.git_url || "#"} className="bg-[#f8f9fa] px-4 py-2 rounded-full border border-[#e0e0e0] text-xs text-[#444746] font-medium flex items-center gap-2 hover:bg-white transition shadow-sm">
               <svg className="w-4 h-4 text-[#1a73e8]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
               GitHub Projeto
             </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-1 space-y-6">
          <div className="card-md3 p-6 shadow-sm border border-[#e0e0e0]">
              <h3 className="text-base font-bold text-[#1f1f1f] mb-4 flex items-center gap-2">🔗 Scopes do Projeto</h3>
              <form action={async (fd) => { "use server"; await createScope(fd); }} className="flex gap-2 mb-6">
                <input name="identificador_scope" placeholder="user:read" className="flex-1 bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-3 py-2.5 text-sm focus:outline-none text-[#1f1f1f]" />
                <button type="submit" className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white rounded-lg px-4 py-2 text-sm font-bold transition shadow-sm">+</button>
              </form>
              <ul className="space-y-1">
                {projeto.scopes.map(scope => (
                  <li key={scope.id} className="text-sm text-[#444746] bg-[#f8f9fa] px-4 py-2.5 rounded-xl border border-transparent hover:border-[#e0e0e0] flex justify-between items-center group/scope transition-all">
                    <span className="font-medium font-mono text-xs">{scope.identificador_scope}</span>
                    <div className="flex gap-1 opacity-0 group-hover/scope:opacity-100 transition-opacity">
                      <EditScopeModal scope={scope} projetoId={projeto.id} />
                      <DeleteScopeButton scopeId={scope.id} projetoId={projeto.id} identificador={scope.identificador_scope} />
                    </div>
                  </li>
                ))}
                {projeto.scopes.length === 0 && <li className="text-xs text-[#70757a] text-center p-4 italic">Nenhum scope cadastrado.</li>}
              </ul>
          </div>
        </div>

        <div className="xl:col-span-3 space-y-6">
          <div className="card-md3 p-8 flex flex-col h-full shadow-sm bg-white overflow-hidden">
            <h3 className="text-xl font-bold text-[#1f1f1f] mb-8">Recursos (Endpoints)</h3>
            
            <div className="mb-10 pb-10 border-b border-[#f1f3f4]">
              <h4 className="text-sm font-bold text-[#5f6368] mb-6 flex items-center gap-2 uppercase tracking-widest">
                <svg className="w-5 h-5 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg> 
                Novo Endpoint
              </h4>
              <form action={async (fd) => { "use server"; await createRecurso(fd); }} className="space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3">
                    <select name="metodo" className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-sm text-[#1f1f1f] focus:outline-none">
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                  </div>
                  <div className="col-span-9">
                    <input name="path" required className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-sm text-[#1f1f1f] focus:outline-none" placeholder="/api/v1/modulo/:id" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <textarea name="request" rows={3} className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-4 py-3 text-xs text-[#444746] font-mono resize-none focus:ring-1 focus:ring-[#1a73e8] focus:bg-white outline-none" placeholder="Exemplo de Request (JSON)..."></textarea>
                   <textarea name="response" rows={3} className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-4 py-3 text-xs text-[#444746] font-mono resize-none focus:ring-1 focus:ring-[#1a73e8] focus:bg-white outline-none" placeholder="Exemplo de Response (JSON)..."></textarea>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <div className="flex gap-6 text-sm font-medium text-[#5f6368]">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#1a73e8]"><input type="checkbox" name="dev" className="w-4 h-4 rounded text-[#1a73e8]" /> DEV</label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#1a73e8]"><input type="checkbox" name="hml" className="w-4 h-4 rounded text-[#1a73e8]" /> HML</label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#1a73e8]"><input type="checkbox" name="prd" className="w-4 h-4 rounded text-[#1a73e8]" /> PRD</label>
                  </div>
                  <button type="submit" className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white font-bold px-8 py-3 rounded-full transition shadow-md w-full sm:w-auto">Adicionar Endpoint</button>
                </div>
              </form>
            </div>

            <div className="overflow-x-auto -mx-8 px-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f1f3f4] text-xs font-bold text-[#5f6368] uppercase tracking-widest">
                    <th className="pb-4 px-4">Método</th>
                    <th className="pb-4 px-4">Path</th>
                    <th className="pb-4 px-4 text-center">Deploy</th>
                    <th className="pb-4 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8f9fa]">
                  {projeto.recursos.map(rec => (
                    <tr key={rec.id} className="hover:bg-[#f8f9fa] transition-colors group">
                      <td className="py-5 px-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          rec.metodo === 'GET' ? 'bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]' : 
                          rec.metodo === 'POST' ? 'bg-[#e6f4ea] text-[#1e8e3e] border-[#ceead6]' : 
                          'bg-[#f1f3f4] text-[#5f6368] border-[#e0e0e0]'
                        }`}>{rec.metodo}</span>
                      </td>
                      <td className="py-5 px-4">
                        <div className="text-sm font-medium text-[#1f1f1f] font-mono mb-2">{rec.path}</div>
                        <div className="flex gap-4">
                          {rec.request && (
                            <details className="text-[10px] text-[#70757a] cursor-pointer group/json">
                              <summary className="hover:text-[#1a73e8] transition-colors font-bold uppercase tracking-wider list-none flex items-center gap-1">
                                <span className="group-open/json:rotate-90 transition-transform">▸</span> Request
                              </summary>
                              <pre className="mt-2 p-4 bg-[#f8f9fa] rounded-2xl border border-[#e0e0e0] text-[#1a73e8] font-mono text-[11px] overflow-x-auto max-w-md shadow-inner">
                                {formatJson(rec.request)}
                              </pre>
                            </details>
                          )}
                          {rec.response && (
                            <details className="text-[10px] text-[#70757a] cursor-pointer group/json">
                              <summary className="hover:text-[#1e8e3e] transition-colors font-bold uppercase tracking-wider list-none flex items-center gap-1">
                                <span className="group-open/json:rotate-90 transition-transform">▸</span> Response
                              </summary>
                              <pre className="mt-2 p-4 bg-[#f8f9fa] rounded-2xl border border-[#e0e0e0] text-[#1e8e3e] font-mono text-[11px] overflow-x-auto max-w-md shadow-inner">
                                {formatJson(rec.response)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex gap-2 justify-center">
                          <form action={async () => { "use server"; await toggleAmbienteAction(rec.id, projeto.id, 'dev', rec.publicado_dev); }}>
                            <button type="submit" title="DEV" className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-[10px] font-bold transition-all border ${rec.publicado_dev ? 'bg-[#e8f0fe] text-[#1a73e8] border-[#1a73e8]' : 'bg-white border-[#e0e0e0] text-[#dadce0] hover:border-[#1a73e8] hover:text-[#1a73e8]'}`}>D</button>
                          </form>
                          <form action={async () => { "use server"; await toggleAmbienteAction(rec.id, projeto.id, 'hml', rec.publicado_hml); }}>
                            <button type="submit" title="HML" className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-[10px] font-bold transition-all border ${rec.publicado_hml ? 'bg-[#fef7e0] text-[#f4b400] border-[#f4b400]' : 'bg-white border-[#e0e0e0] text-[#dadce0] hover:border-[#f4b400] hover:text-[#f4b400]'}`}>H</button>
                          </form>
                          <form action={async () => { "use server"; await toggleAmbienteAction(rec.id, projeto.id, 'prd', rec.publicado_prd); }}>
                            <button type="submit" title="PRD" className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-[10px] font-bold transition-all border ${rec.publicado_prd ? 'bg-[#e6f4ea] text-[#1e8e3e] border-[#1e8e3e]' : 'bg-white border-[#e0e0e0] text-[#dadce0] hover:border-[#1e8e3e] hover:text-[#1e8e3e]'}`}>P</button>
                          </form>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-right">
                        <div className="flex gap-2 justify-end items-center transition-opacity">
                          <EditResourceModal 
                            recurso={{
                              id: rec.id,
                              metodo: rec.metodo,
                              path: rec.path,
                              request: rec.request,
                              response: rec.response,
                              anotacoes: rec.anotacoes,
                              publicado_dev: rec.publicado_dev,
                              publicado_hml: rec.publicado_hml,
                              publicado_prd: rec.publicado_prd,
                            }} 
                            projetoId={projeto.id} 
                          />
                          <DeleteResourceButton recursoId={rec.id} projetoId={projeto.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {projeto.recursos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-16 text-[#70757a] text-sm italic">Nenhum endpoint adicionado. Use o formulário acima para começar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
