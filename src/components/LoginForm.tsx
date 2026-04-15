"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth-actions";

export function LoginForm() {
  const [error, action, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="bg-gray-800/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">API Governance</h1>
        <p className="text-gray-400">Acesse com o simulador Gov.br</p>
      </div>

      <form action={action} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="cpf">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            required
            placeholder="Qualquer valor numérico"
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="senha">
            Senha
          </label>
          <input
            type="password"
            id="senha"
            name="senha"
            required
            defaultValue="admin"
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-white"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex justify-center"
        >
          {isPending ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            "Entrar"
          )}
        </button>
      </form>
    </div>
  );
}
