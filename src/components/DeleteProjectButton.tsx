"use client";

import { deleteProjectAction } from "@/lib/actions/project-actions";
import { useRouter } from "next/navigation";

export default function DeleteProjectButton({ 
  projectId, 
  projectName, 
  redirectAfter = false 
}: { 
  projectId: string; 
  projectName: string;
  redirectAfter?: boolean;
}) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Evita navegar se estiver dentro de um Link
    e.stopPropagation();

    if (confirm(`Tem certeza que deseja excluir permanentemente o projeto "${projectName}"?\nTodos os recursos e scopes serão removidos.`)) {
      const res = await deleteProjectAction(projectId);
      if (res.success && redirectAfter) {
        router.push("/dashboard");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-500/10"
      title="Excluir Projeto"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}
