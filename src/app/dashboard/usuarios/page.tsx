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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700/50 p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-white mb-2">Gestão de Usuários</h1>
        <p className="text-gray-400">Administre o acesso à plataforma de governança.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form para novo usuário */}
        <div className="xl:col-span-1">
          <div className="bg-gray-800/40 border border-gray-700/80 p-6 rounded-2xl backdrop-blur-md sticky top-8">
            <h2 className="text-xl font-bold text-white mb-6">Novo Usuário</h2>
            <form action={async (fd) => { "use server"; await createUserAction(fd); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nome Completo</label>
                <input name="nome" required className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">E-mail</label>
                <input name="email" type="email" required className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CPF</label>
                <input name="cpf" required className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 transition" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Senha Inicial</label>
                <input name="senha" type="password" required className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Perfil de Acesso</label>
                <select name="perfil_acesso" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 transition">
                  <option value="USER">Usuário (Leitura)</option>
                  <option value="ADMIN">Administrador (Full)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]">
                Criar Usuário
              </button>
            </form>
          </div>
        </div>

        {/* Listagem de usuários */}
        <div className="xl:col-span-2">
          <div className="bg-gray-800/40 border border-gray-700/80 p-0 rounded-2xl overflow-hidden backdrop-blur-md">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-700/60 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Perfil</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-700/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-semibold">{u.nome}</span>
                        <span className="text-gray-500 text-xs">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.perfil_acesso === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                        {u.perfil_acesso}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center">
                        <EditUserModal usuario={{
                          id: u.id,
                          nome: u.nome || "",
                          email: u.email || "",
                          cpf: u.cpf || "",
                          perfil_acesso: u.perfil_acesso || "USER"
                        }} />
                        {session.user.id !== u.id && (
                          <form action={async () => { "use server"; await deleteUserAction(u.id); }}>
                            <button className="text-gray-500 hover:text-red-500 transition-colors text-sm font-medium">
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
