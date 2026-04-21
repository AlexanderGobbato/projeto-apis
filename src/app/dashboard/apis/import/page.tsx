"use client";

import { useState } from "react";
import { parseSwagger, ResolvedProject, SwaggerJSON } from "@/lib/swagger-resolver";
import { importSwaggerAction } from "@/lib/actions/import-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ImportSwaggerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ResolvedProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);
    setError(null);

    try {
      const text = await selectedFile.text();
      const json = JSON.parse(text) as SwaggerJSON;
      const parsed = parseSwagger(json);
      setPreviewData(parsed);
    } catch (err) {
      console.error(err);
      setError("Falha ao processar o arquivo. Verifique se é um Swagger JSON válido.");
      setPreviewData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!previewData) return;

    setImporting(true);
    setError(null);

    try {
      const result = await importSwaggerAction(previewData);
      if (result.success) {
        router.push(`/dashboard/projetos/${result.projetoId}`);
      } else {
        setError(result.error || "Erro desconhecido ao importar.");
      }
    } catch (err) {
      setError("Erro de rede ou permissão ao tentar importar.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/apis" className="p-2 hover:bg-[#e8f0fe] rounded-full transition-colors text-[#1a73e8]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-[#1f1f1f] tracking-tight">Importar Swagger</h1>
          <p className="text-[#5f6368] mt-2 text-base">Faça upload do arquivo JSON de documentação para popular automaticamente seu projeto e recursos.</p>
        </div>
      </div>

      <div className="card-md3 p-8 bg-white border border-[#e0e0e0] shadow-sm">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#dadce0] rounded-[24px] p-12 transition-all hover:border-[#1a73e8] hover:bg-[#f8f9fa] group">
          <input 
            type="file" 
            accept=".json" 
            onChange={handleFileChange} 
            className="hidden" 
            id="swagger-upload" 
          />
          <label htmlFor="swagger-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 bg-[#e8f0fe] text-[#1a73e8] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#1f1f1f]">Clique para fazer upload</span>
            <span className="text-sm text-[#5f6368] mt-1">Apenas arquivos .json suportados</span>
          </label>
          {file && <p className="mt-4 text-sm font-bold text-[#1a73e8] bg-[#e8f0fe] px-4 py-1 rounded-full">{file.name}</p>}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-[#fde8e8] border border-[#fad2cf] rounded-xl text-[#d93025] text-sm font-medium flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center py-20 animate-pulse">
           <div className="w-12 h-12 border-4 border-[#1a73e8] border-t-transparent rounded-full animate-spin"></div>
           <p className="mt-4 text-[#5f6368] font-medium">Analisando Swagger...</p>
        </div>
      )}

      {previewData && !loading && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-md3 p-6 bg-white border border-[#e0e0e0] shadow-sm">
                <h3 className="text-sm font-bold text-[#5f6368] uppercase tracking-widest mb-4">Informações do Projeto</h3>
                <div className="space-y-3">
                   <div>
                      <p className="text-xs text-[#70757a] font-bold">Título</p>
                      <p className="text-xl font-bold text-[#1f1f1f]">{previewData.nome}</p>
                   </div>
                   <div>
                      <p className="text-xs text-[#70757a] font-bold">URL Base</p>
                      <p className="text-sm font-mono text-[#1a73e8] bg-[#f1f3f4] p-2 rounded-lg mt-1">{previewData.url_base || "Não definida"}</p>
                   </div>
                </div>
              </div>

              <div className="card-md3 p-6 bg-white border border-[#e0e0e0] shadow-sm">
                <h3 className="text-sm font-bold text-[#5f6368] uppercase tracking-widest mb-4">Scopes Identificados ({previewData.scopes.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {previewData.scopes.map((s, i) => (
                    <span key={i} className="text-[10px] font-bold font-mono bg-[#f8f9fa] border border-[#dadce0] px-3 py-1 rounded-full text-[#444746]" title={s.descricao}>
                      {s.nome}
                    </span>
                  ))}
                  {previewData.scopes.length === 0 && <p className="text-sm text-[#70757a] italic">Nenhum scope encontrado.</p>}
                </div>
              </div>
           </div>

           <div className="card-md3 p-8 bg-white border border-[#e0e0e0] shadow-sm overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#1f1f1f]">Endpoints Encontrados ({previewData.recursos.length})</h3>
                <button 
                  onClick={handleImport}
                  disabled={importing}
                  className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white font-bold px-8 py-3 rounded-full transition shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Importando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmar Importação
                    </>
                  )}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#f1f3f4] text-[10px] font-bold text-[#5f6368] uppercase tracking-[0.2em] bg-[#f8f9fa]">
                      <th className="py-4 px-4 rounded-tl-xl">Método</th>
                      <th className="py-4 px-4">Path / Descrição</th>
                      <th className="py-4 px-4">Tag</th>
                      <th className="py-4 px-4 rounded-tr-xl">Mock Resposta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f8f9fa]">
                    {previewData.recursos.map((rec, i) => (
                      <tr key={i} className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="py-4 px-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                            rec.metodo === 'GET' ? 'bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]' : 
                            rec.metodo === 'POST' ? 'bg-[#e6f4ea] text-[#1e8e3e] border-[#ceead6]' : 
                            rec.metodo === 'PUT' ? 'bg-[#fef7e0] text-[#f4b400] border-[#fce8b2]' : 
                            rec.metodo === 'DELETE' ? 'bg-[#fde8e8] text-[#d93025] border-[#fad2cf]' : 
                            'bg-[#f1f3f4] text-[#5f6368] border-[#e0e0e0]'
                          }`}>{rec.metodo}</span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm font-mono font-medium text-[#1f1f1f]">{rec.path}</p>
                          <p className="text-xs text-[#5f6368] mt-1 line-clamp-1">{rec.descricao || "Sem descrição"}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-[10px] font-bold text-[#5f6368] bg-[#f1f3f4] px-2 py-0.5 rounded border border-[#e0e0e0]">
                            {rec.tag}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <details className="text-[10px] cursor-pointer group/json">
                             <summary className="text-[#1a73e8] font-bold uppercase hover:underline list-none">Ver Mock</summary>
                             <pre className="mt-2 p-3 bg-[#f8f9fa] border border-[#e0e0e0] rounded-lg text-[9px] font-mono max-w-xs overflow-auto max-h-32 shadow-inner">
                               {JSON.stringify(rec.modelo_json, null, 2)}
                             </pre>
                          </details>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
