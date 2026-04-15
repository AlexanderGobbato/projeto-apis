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
        className="text-[#1a73e8] hover:bg-[#e8f0fe] px-4 py-2 rounded-lg transition-colors text-xs font-bold uppercase tracking-tighter"
      >
        Editar
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-500/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="modal-md3 p-8 w-full max-w-md relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-[#5f6368] hover:bg-[#f1f3f4] p-2 rounded-full transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-semibold text-[#1f1f1f] mb-2">Editar Membro</h2>
        <p className="text-sm text-[#70757a] mb-8">Atualize as informações de acesso e o perfil deste usuário.</p>

        <form 
          action={async (fd) => {
            await updateUserAction(usuario.id, fd);
            setIsOpen(false);
          }} 
          className="space-y-6"
        >
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">Nome Completo</label>
            <input name="nome" defaultValue={usuario.nome} required className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">E-mail</label>
            <input name="email" type="email" defaultValue={usuario.email} required className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">CPF</label>
            <input name="cpf" defaultValue={usuario.cpf} required className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">Nova Senha (Opcional)</label>
            <input name="senha" type="password" className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors" placeholder="••••••••" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#444746] ml-1 uppercase">Perfil de Acesso</label>
            <select name="perfil_acesso" defaultValue={usuario.perfil_acesso} className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors">
              <option value="USER">Usuário (Leitura)</option>
              <option value="ADMIN">Administrador (Total)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-2.5 rounded-full text-[#1a73e8] font-bold hover:bg-[#e8f0fe] transition text-sm">Cancelar</button>
            <button type="submit" className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white font-bold py-2.5 px-8 rounded-full shadow-md transition text-sm">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}
