"use client";

import { useState } from "react";
import { updateRecursoAction } from "@/lib/actions/resource-actions";

interface Recurso {
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
  recurso: Recurso; 
  projetoId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[#5f6368] hover:bg-[#f1f3f4] p-2 rounded-full transition"
        title="Editar Recurso"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-500/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="modal-md3 p-8 w-full max-w-2xl relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-[#5f6368] hover:bg-[#f1f3f4] p-2 rounded-full transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-semibold text-[#1f1f1f] mb-2">Editar Endpoint</h2>
        <p className="text-sm text-[#70757a] mb-8">Ajuste as especificações técnicas da rota selecionada.</p>

        <form 
          action={async (fd) => {
            await updateRecursoAction(recurso.id, projetoId, fd);
            setIsOpen(false);
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 space-y-1">
               <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">Método</label>
               <select name="metodo" defaultValue={recurso.metodo} className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div className="col-span-9 space-y-1">
              <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">Path</label>
              <input name="path" defaultValue={recurso.path} required className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">Exemplo de Request (JSON)</label>
              <textarea name="request" rows={5} defaultValue={recurso.request || ""} className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-4 py-3 text-xs text-[#1f1f1f] font-mono resize-none focus:bg-white focus:ring-1 focus:ring-[#1a73e8] outline-none transition-all"></textarea>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">Exemplo de Response (JSON)</label>
              <textarea name="response" rows={5} defaultValue={recurso.response || ""} className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-4 py-3 text-xs text-[#1f1f1f] font-mono resize-none focus:bg-white focus:ring-1 focus:ring-[#1a73e8] outline-none transition-all"></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-2.5 rounded-full text-[#1a73e8] font-bold hover:bg-[#e8f0fe] transition text-sm">Cancelar</button>
            <button type="submit" className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white font-bold py-2.5 px-8 rounded-full shadow-md transition text-sm">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}
