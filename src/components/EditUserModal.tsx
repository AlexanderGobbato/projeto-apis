"use client";

import { useState } from "react";
import { updateUserAction } from "@/lib/actions/user-actions";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  perfil_acesso: string;
}

export default function EditUserModal({ usuario }: { usuario: Usuario }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium mr-4"
      >
        Editar
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-700/60 rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Editar Usuário</h2>

        <form 
          action={async (fd) => {
            await updateUserAction(usuario.id, fd);
            setIsOpen(false);
          }} 
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
            <input name="nome" defaultValue={usuario.nome} required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
            <input name="email" type="email" defaultValue={usuario.email} required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CPF</label>
            <input name="cpf" defaultValue={usuario.cpf} required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nova Senha (Deixe em branco para manter)</label>
            <input name="senha" type="password" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 transition" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Perfil de Acesso</label>
            <select name="perfil_acesso" defaultValue={usuario.perfil_acesso} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 transition">
              <option value="USER">Usuário (Leitura)</option>
              <option value="ADMIN">Administrador (Full)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 rounded-xl text-gray-300 hover:bg-gray-800 transition">Cancelar</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl transition">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}
