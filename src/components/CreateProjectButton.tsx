"use client";

import { useState } from "react";
import CreateProjectModal from "./CreateProjectModal";

export default function CreateProjectButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#c2e7ff] hover:bg-[#b3d7ef] text-[#001d35] font-semibold py-4 px-6 rounded-[20px] transition duration-200 shadow-sm flex items-center gap-3 group"
        title="Novo Projeto"
      >
        <svg className="w-6 h-6 text-[#001d35] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-sm">Novo Projeto</span>
      </button>
      
      {isOpen && <CreateProjectModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
