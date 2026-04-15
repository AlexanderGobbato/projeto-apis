"use client";

import { useState } from "react";
import { updateScopeAction } from "@/lib/actions/resource-actions";

export default function EditScopeModal({ 
  scope, 
  projetoId 
}: { 
  scope: { id: string, identificador_scope: string }; 
  projetoId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-gray-500 hover:text-blue-400 transition-colors p-1"
        title="Editar Scope"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-white mb-4">Editar Scope</h3>
        
        <form 
          action={async (fd) => {
            await updateScopeAction(scope.id, projetoId, fd);
            setIsOpen(false);
          }}
          className="space-y-4"
        >
          <input 
            name="identificador_scope" 
            defaultValue={scope.identificador_scope} 
            required 
            placeholder="Ex: user:write"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 transition"
          />
          
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">Cancelar</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
