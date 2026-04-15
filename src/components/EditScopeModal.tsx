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
        className="text-[#5f6368] hover:bg-[#f1f3f4] transition-colors p-1 rounded-md"
        title="Editar Scope"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-500/10 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="modal-md3 p-6 w-full max-w-xs relative animate-in zoom-in-95 duration-200">
        <h3 className="text-base font-bold text-[#1f1f1f] mb-4">Editar Identificador</h3>
        
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
            autoFocus
            className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-3 py-2 text-sm text-[#1f1f1f] focus:outline-none transition-colors"
          />
          
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-xs font-bold text-[#1a73e8] hover:bg-[#e8f0fe] rounded-full transition">Devolver</button>
            <button type="submit" className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-sm">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
