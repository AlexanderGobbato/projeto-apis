import { prisma, auth } from "@/auth";
import { redirect } from "next/navigation";
import { createUserAction, deleteUserAction, updateUserAction } from "@/lib/actions/user-actions";
import EditUserModal from "@/components/EditUserModal";

export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const usuarios = await prisma.usuario.findMany({
    orderBy: { criadoEm: "desc" }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
      <div className="bg-white border border-[#e0e0e0] p-10 rounded-[32px] shadow-sm">
        <h1 className="text-3xl font-bold text-[#1f1f1f] mb-2">Gestão de Usuários</h1>
        <p className="text-[#5f6368] text-base">Administre o acesso e permissões da plataforma de governança.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form para novo usuário */}
        <div className="xl:col-span-1">
          <div className="bg-white border border-[#e0e0e0] p-8 rounded-[24px] shadow-sm sticky top-8">
            <h2 className="text-lg font-bold text-[#1f1f1f] mb-8 uppercase tracking-widest text-xs">Novo Membro</h2>
            <form action={async (fd) => { "use server"; await createUserAction(fd); }} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#444746] ml-1">NOME COMPLETO</label>
                <input name="nome" required className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#444746] ml-1">E-MAIL</label>
                <input name="email" type="email" required className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#444746] ml-1">CPF</label>
                <input name="cpf" required className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors" placeholder="000.000.000-00" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#444746] ml-1">SENHA INICIAL</label>
                <input name="senha" type="password" required className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#444746] ml-1">PERFIL DE ACESSO</label>
                <select name="perfil_acesso" className="w-full bg-[#f1f3f4] border-b-2 border-transparent focus:border-[#1a73e8] rounded-t-lg px-4 py-3 text-[#1f1f1f] focus:outline-none transition-colors">
                  <option value="USER">Usuário (Leitura)</option>
                  <option value="ADMIN">Administrador (Total)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#1a73e8] hover:bg-[#1b66c9] text-white font-bold py-3.5 rounded-full shadow-md transition-all">
                Criar Usuário
              </button>
            </form>
          </div>
        </div>

        {/* Listagem de usuários */}
        <div className="xl:col-span-2">
          <div className="bg-white border border-[#e0e0e0] rounded-[24px] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e0e0e0] text-[11px] font-bold text-[#5f6368] uppercase tracking-widest">
                  <th className="px-8 py-5">Membro</th>
                  <th className="px-8 py-5">Perfil</th>
                  <th className="px-8 py-5 text-right">Controle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f4]">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f8f9fa] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#1a73e8] font-bold flex items-center justify-center border border-[#d2e3fc]">
                          {u.nome?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#1f1f1f] font-bold text-sm">{u.nome}</span>
                          <span className="text-[#5f6368] text-xs leading-none mt-1">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.perfil_acesso === 'ADMIN' ? 'bg-[#fef7e0] text-[#f4b400] border border-[#fce8b2]' : 'bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]'}`}>
                        {u.perfil_acesso}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end items-center gap-4 transition-opacity">
                        <EditUserModal usuario={{
                          id: u.id,
                          nome: u.nome || "",
                          email: u.email || "",
                          cpf: u.cpf || "",
                          perfil_acesso: u.perfil_acesso || "USER"
                        }} />
                        {session.user.id !== u.id && (
                          <form action={async () => { "use server"; await deleteUserAction(u.id); }}>
                            <button className="text-[#d93025] hover:bg-[#fde8e8] px-3 py-1 rounded-lg transition-colors text-xs font-bold uppercase tracking-tighter">
                              Remover
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
