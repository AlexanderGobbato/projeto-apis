"use server";

import { prisma, auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createUserAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Não autorizado" };
  }

  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const cpf = formData.get("cpf") as string;
  const senha = formData.get("senha") as string;
  const perfil = formData.get("perfil_acesso") as string;

  if (!nome || !email || !senha) {
    return { error: "Campos obrigatórios ausentes" };
  }

  try {
    const hashSenha = await bcrypt.hash(senha, 10);
    await prisma.usuario.create({
      data: {
        nome,
        email,
        cpf: cpf.replace(/\D/g, ""),
        senha: hashSenha,
        perfil_acesso: perfil || "USER"
      }
    });

    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "E-mail ou CPF já cadastrado" };
    }
    return { error: "Erro ao criar usuário" };
  }
}

export async function deleteUserAction(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Não autorizado" };
  }

  // Não permitir excluir a si mesmo
  if (session.user.id === id) {
    return { error: "Você não pode excluir sua própria conta" };
  }

  try {
    await prisma.usuario.delete({
      where: { id }
    });

    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao excluir usuário" };
  }
}

export async function updateUserAction(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Não autorizado" };
  }

  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const cpf = formData.get("cpf") as string;
  const senha = formData.get("senha") as string;
  const perfil = formData.get("perfil_acesso") as string;

  try {
    const data: any = {
      nome,
      email,
      cpf: cpf.replace(/\D/g, ""),
      perfil_acesso: perfil
    };

    if (senha) {
      data.senha = await bcrypt.hash(senha, 10);
    }

    await prisma.usuario.update({
      where: { id },
      data
    });

    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error: any) {
    return { error: "Erro ao atualizar usuário" };
  }
}
