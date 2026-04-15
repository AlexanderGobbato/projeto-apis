"use client";

import { deleteRecursoAction } from "@/lib/actions/resource-actions";

export default function DeleteResourceButton({ 
  recursoId, 
  projetoId 
}: { 
  recursoId: string; 
  projetoId: string;
}) {
  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir permanentemente este endpoint?")) {
      await deleteRecursoAction(recursoId, projetoId);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-gray-500 hover:text-red-500 transition-colors text-sm font-medium"
    >
      Excluir
    </button>
  );
}
