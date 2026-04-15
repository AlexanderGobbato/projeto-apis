"use server";

import { prisma } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createProjectAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    
    await prisma.projeto.create({
      data: {
        nome_projeto: data.nome_projeto as string,
        server: data.server as string,
        url_base: data.url_base as string,
        git_url: data.git_url as string,
        anotacoes: data.anotacoes as string,
      }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao criar projeto." };
  }
}
