"use server";

import { prisma } from "@/auth";
import { revalidatePath } from "next/cache";
import { ResolvedProject } from "@/lib/swagger-resolver";

export async function importSwaggerAction(data: ResolvedProject) {
  try {
    // 1. Upsert Projeto (Busca por nome, se não achar cria)
    let projeto = await prisma.projeto.findFirst({
      where: { nome_projeto: data.nome }
    });

    if (projeto) {
      projeto = await prisma.projeto.update({
        where: { id: projeto.id },
        data: {
          url_base: data.url_base,
        }
      });
    } else {
      projeto = await prisma.projeto.create({
        data: {
          nome_projeto: data.nome,
          url_base: data.url_base,
        }
      });
    }

    const projetoId = projeto.id;

    // 2. Salvar Scopes
    if (data.scopes && data.scopes.length > 0) {
      for (const scope of data.scopes) {
        // Evitar duplicidade de escopo no mesmo projeto
        const existingScope = await prisma.scope.findFirst({
          where: {
            projeto_id: projetoId,
            identificador_scope: scope.nome
          }
        });

        if (!existingScope) {
          await prisma.scope.create({
            data: {
              projeto_id: projetoId,
              identificador_scope: scope.nome
            }
          });
        }
      }
    }

    // 3. Salvar Recursos
    if (data.recursos && data.recursos.length > 0) {
      for (const rec of data.recursos) {
        // Busca se já existe o recurso (mesmo path e método no mesmo projeto)
        const existingRec = await prisma.recurso.findFirst({
          where: {
            projeto_id: projetoId,
            path: rec.path,
            metodo: rec.metodo
          }
        });

        const recursoData = {
          projeto_id: projetoId,
          metodo: rec.metodo,
          path: rec.path,
          tag: rec.tag,
          descricao: rec.descricao,
          request: rec.request,
          response: rec.response,
          modelo_json: rec.modelo_json as any,
        };

        if (existingRec) {
          await prisma.recurso.update({
            where: { id: existingRec.id },
            data: recursoData
          });
        } else {
          await prisma.recurso.create({
            data: recursoData
          });
        }
      }
    }

    revalidatePath(`/dashboard/projetos/${projetoId}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/apis");

    return { success: true, projetoId };
  } catch (error) {
    console.error("Erro na importação:", error);
    return { error: "Erro ao processar a importação para o banco de dados." };
  }
}
