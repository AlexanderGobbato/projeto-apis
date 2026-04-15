"use client";

import { deleteScopeAction } from "@/lib/actions/resource-actions";

export default function DeleteScopeButton({ 
  scopeId, 
  projetoId, 
  identificador 
}: { 
  scopeId: string; 
  projetoId: string;
  identificador: string;
}) {
  const handleDelete = async () => {
    if (confirm(`Excluir o scope "${identificador}"?`)) {
      await deleteScopeAction(scopeId, projetoId);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-gray-500 hover:text-red-500 transition-colors p-1"
      title="Excluir Scope"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}
