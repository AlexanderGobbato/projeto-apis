"use client";

import { useState } from "react";
import { updateProjectAction } from "@/lib/actions/project-actions";

interface Projeto {
  id: string;
  nome_projeto: string;
  server: string | null;
  url_base: string | null;
  git_url: string | null;
  anotacoes: string | null;
}

export default function EditProjectModal({ 
  projeto, 
  onClose 
}: { 
  projeto: Projeto; 
  onClose?: () => void 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) {
    return (
      <button 
        onClick={handleOpen}
        className="text-[#5f6368] hover:bg-[#f1f3f4] transition-colors p-2 rounded-full"
        title="Editar Projeto"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-500/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="modal-md3 p-8 w-full max-w-lg relative animate-in zoom-in-95 duration-200"
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-[#5f6368] hover:bg-[#f1f3f4] p-2 rounded-full transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-semibold text-[#1f1f1f] mb-2">Editar Projeto</h2>
        <p className="text-sm text-[#70757a] mb-8">Atualize as informações técnicas e metadados de governança.</p>

        <form 
          action={async (fd) => {
            await updateProjectAction(projeto.id, fd);
            handleClose();
          }} 
          className="space-y-6"
        >
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">Nome do Projeto</label>
            <input name="nome_projeto" defaultValue={projeto.nome_projeto} required className="w-full px-4 py-3 bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg text-[#1f1f1f] focus:outline-none transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">Servidor</label>
              <input name="server" defaultValue={projeto.server || ""} className="w-full px-4 py-3 bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg text-[#1f1f1f] focus:outline-none transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">URL Base</label>
              <input name="url_base" defaultValue={projeto.url_base || ""} className="w-full px-4 py-3 bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg text-[#1f1f1f] focus:outline-none transition-colors" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">Repositório Git</label>
            <input name="git_url" defaultValue={projeto.git_url || ""} className="w-full px-4 py-3 bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg text-[#1f1f1f] focus:outline-none transition-colors" />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">Anotações / Descrição</label>
            <textarea name="anotacoes" defaultValue={projeto.anotacoes || ""} rows={3} className="w-full px-4 py-3 bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg text-[#1f1f1f] focus:outline-none transition-colors resize-none"></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleClose} className="px-6 py-2.5 rounded-full text-[#1a73e8] font-bold hover:bg-[#e8f0fe] transition text-sm">
              Cancelar
            </button>
            <button 
              type="submit" 
              className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white font-bold py-2.5 px-8 rounded-full shadow-md transition text-sm"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
