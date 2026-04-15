"use server";

import { prisma } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createScopeAction(projetoId: string, formData: FormData) {
  try {
    const identificador = formData.get("identificador_scope") as string;
    if (!identificador) return { error: "Identificador é obrigatório" };

    await prisma.scope.create({
      data: {
        projeto_id: projetoId,
        identificador_scope: identificador
      }
    });

    revalidatePath(`/dashboard/projetos/${projetoId}`);
    return { success: true };
  } catch (e) {
    return { error: "Erro ao criar Scope" };
  }
}

export async function createRecursoAction(projetoId: string, formData: FormData) {
  try {
    await prisma.recurso.create({
      data: {
        projeto_id: projetoId,
        metodo: formData.get("metodo") as string,
        path: formData.get("path") as string,
        request: formData.get("request") as string || "{}",
        response: formData.get("response") as string || "{}",
        anotacoes: formData.get("anotacoes") as string || "",
        publicado_dev: formData.get("dev") === "on",
        publicado_hml: formData.get("hml") === "on",
        publicado_prd: formData.get("prd") === "on",
      }
    });

    revalidatePath(`/dashboard/projetos/${projetoId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    return { error: "Erro ao criar recurso" };
  }
}

export async function toggleAmbienteAction(recursoId: string, projetoId: string, ambiente: 'dev' | 'hml' | 'prd', atual: boolean) {
  try {
    const data: any = {};
    if (ambiente === 'dev') data.publicado_dev = !atual;
    if (ambiente === 'hml') data.publicado_hml = !atual;
    if (ambiente === 'prd') data.publicado_prd = !atual;

    await prisma.recurso.update({
      where: { id: recursoId },
      data
    });

    revalidatePath(`/dashboard/projetos/${projetoId}`);
    return { success: true };
  } catch (e) {
    return { error: "Erro ao atualizar" };
  }
}
