"use client";

import { useState } from "react";
import { updateRecursoAction } from "@/lib/actions/resource-actions";

interface Resource {
  id: string;
  metodo: string;
  path: string;
  request: string | null;
  response: string | null;
  anotacoes: string | null;
  publicado_dev: boolean;
  publicado_hml: boolean;
  publicado_prd: boolean;
}

export default function EditResourceModal({ 
  recurso, 
  projetoId 
}: { 
  recurso: Resource; 
  projetoId: string 
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
      >
        Editar
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-gray-800 border border-gray-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
            <h3 className="text-xl font-bold text-white">Editar Endpoint</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form 
            action={async (fd) => {
              await updateRecursoAction(recurso.id, projetoId, fd);
              setIsOpen(false);
            }} 
            className="p-6 space-y-4"
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Método</label>
                <select 
                  name="metodo" 
                  defaultValue={recurso.metodo}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              <div className="col-span-8">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Path</label>
                <input 
                  name="path" 
                  defaultValue={recurso.path} 
                  required 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 transition" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Exemplo de Request</label>
                <textarea 
                  name="request" 
                  defaultValue={recurso.request || ""}
                  rows={6} 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-xs text-gray-300 font-mono resize-none focus:ring-2 focus:ring-blue-500 transition" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Exemplo de Response</label>
                <textarea 
                  name="response" 
                  defaultValue={recurso.response || ""}
                  rows={6} 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-xs text-gray-300 font-mono resize-none focus:ring-2 focus:ring-blue-500 transition" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Anotações / Notas Técnicas</label>
              <textarea 
                name="anotacoes" 
                defaultValue={recurso.anotacoes || ""}
                rows={2} 
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 focus:ring-2 focus:ring-blue-500 transition" 
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div className="flex gap-4 text-xs font-bold text-gray-500 uppercase">
                <label className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors">
                  <input type="checkbox" name="dev" defaultChecked={recurso.publicado_dev} className="rounded bg-gray-900 border-gray-700 text-blue-600" /> DEV
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-amber-400 transition-colors">
                  <input type="checkbox" name="hml" defaultChecked={recurso.publicado_hml} className="rounded bg-gray-900 border-gray-700 text-amber-600" /> HML
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-400 transition-colors">
                  <input type="checkbox" name="prd" defaultChecked={recurso.publicado_prd} className="rounded bg-gray-900 border-gray-700 text-emerald-600" /> PRD
                </label>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white transition-colors font-bold uppercase text-xs">Cancelar</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 uppercase text-xs">Salvar Alterações</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
