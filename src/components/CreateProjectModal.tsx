"use client";

import { useActionState, useEffect } from "react";
import { createProjectAction } from "@/lib/actions/project-actions";

export default function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const [state, action, isPending] = useActionState(createProjectAction, undefined);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-gray-900 border border-gray-700/60 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-300"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Criar Novo Projeto</h2>

        <form action={action} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nome do Projeto *</label>
            <input name="nome_projeto" required className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: API de Pagamentos" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Servidor (Env)</label>
              <input name="server" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: AWS / On-Premise" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">URL Base</label>
              <input name="url_base" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://api.empresa.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">URL do Repositório (Git)</label>
            <input name="git_url" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://github.com/empresa/repo" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Anotações / Descrição</label>
            <textarea name="anotacoes" rows={3} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Detalhes técnicos, regras de negócio..."></textarea>
          </div>

          {state?.error && (
            <div className="text-red-400 text-sm">{state.error}</div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-gray-300 hover:bg-gray-800 transition">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-xl flex items-center justify-center min-w-[120px] transition disabled:opacity-50"
            >
              {isPending ? "Salvando..." : "Criar Projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
