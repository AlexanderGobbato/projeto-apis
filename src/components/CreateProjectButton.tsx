"use client";

import { useState } from "react";
import CreateProjectModal from "./CreateProjectModal";

export default function CreateProjectButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl transition duration-200 shadow-lg shadow-blue-500/25 flex items-center gap-2 transform hover:scale-105 active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Novo Projeto
      </button>
      
      {isOpen && <CreateProjectModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
