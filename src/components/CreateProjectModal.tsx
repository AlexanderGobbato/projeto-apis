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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-500/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="modal-md3 p-8 w-full max-w-lg relative animate-in zoom-in-95 duration-300"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[#5f6368] hover:bg-[#f1f3f4] p-2 rounded-full transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-semibold text-[#1f1f1f] mb-2">Criar Projeto</h2>
        <p className="text-sm text-[#70757a] mb-8">Insira os detalhes técnicos para iniciar a governança deste projeto.</p>

        <form action={action} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">NOME DO PROJETO</label>
            <input name="nome_projeto" required className="w-full px-4 py-3 bg-[#f1f3f4] border-b-2 border-[#1a73e8] rounded-t-lg text-[#1f1f1f] focus:outline-none focus:bg-[#e8f0fe] transition-all" placeholder="Ex: API de Pagamentos" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">SERVIDOR</label>
              <input name="server" className="w-full px-4 py-3 bg-[#f1f3f4] border-b-2 border-[#1a73e8] rounded-t-lg text-[#1f1f1f] focus:outline-none focus:bg-[#e8f0fe] transition-all" placeholder="AWS / On-Prem" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">URL BASE</label>
              <input name="url_base" className="w-full px-4 py-3 bg-[#f1f3f4] border-b-2 border-[#1a73e8] rounded-t-lg text-[#1f1f1f] focus:outline-none focus:bg-[#e8f0fe] transition-all" placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">REPOSITÓRIO GIT</label>
            <input name="git_url" className="w-full px-4 py-3 bg-[#f1f3f4] border-b-2 border-[#1a73e8] rounded-t-lg text-[#1f1f1f] focus:outline-none focus:bg-[#e8f0fe] transition-all" placeholder="https://github.com/..." />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">ANOTAÇÕES</label>
            <textarea name="anotacoes" rows={3} className="w-full px-4 py-3 bg-[#f1f3f4] border-b-2 border-[#1a73e8] rounded-t-lg text-[#1f1f1f] focus:outline-none focus:bg-[#e8f0fe] transition-all resize-none" placeholder="Detalhes técnicos relevantes..."></textarea>
          </div>

          {state?.error && (
            <div className="bg-red-50 text-[#d93025] p-3 rounded-lg text-xs font-medium border border-red-100">{state.error}</div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-[#1a73e8] font-semibold hover:bg-[#e8f0fe] transition text-sm">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white font-semibold py-2.5 px-8 rounded-full shadow-md transition disabled:opacity-50 text-sm"
            >
              {isPending ? "Salvando..." : "Criar Projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
