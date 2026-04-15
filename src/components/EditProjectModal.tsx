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
        className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded-lg hover:bg-blue-400/10"
        title="Editar Projeto"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-gray-900 border border-gray-700/60 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-300"
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Editar Projeto</h2>

        <form 
          action={async (fd) => {
            await updateProjectAction(projeto.id, fd);
            handleClose();
          }} 
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nome do Projeto *</label>
            <input name="nome_projeto" defaultValue={projeto.nome_projeto} required className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Servidor (Env)</label>
              <input name="server" defaultValue={projeto.server || ""} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">URL Base</label>
              <input name="url_base" defaultValue={projeto.url_base || ""} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">URL do Repositório (Git)</label>
            <input name="git_url" defaultValue={projeto.git_url || ""} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Anotações / Descrição</label>
            <textarea name="anotacoes" defaultValue={projeto.anotacoes || ""} rows={3} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-xl text-gray-300 hover:bg-gray-800 transition">
              Cancelar
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-xl flex items-center justify-center min-w-[120px] transition"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
