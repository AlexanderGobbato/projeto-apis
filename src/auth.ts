import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"

// Evita várias instâncias do Prisma em ambiente de dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Simulador Gov.br',
      credentials: {
        cpf: { label: "CPF", type: "text", placeholder: "Insira qualquer CPF" },
        senha: { label: "Senha", type: "password", placeholder: "admin" }
      },
      async authorize(credentials) {
        if (!credentials?.cpf || credentials.senha !== "admin") return null;
        
        const cpfLimpo = (credentials.cpf as string).replace(/\D/g, "");

        let user = await prisma.usuario.findUnique({
          where: { cpf: cpfLimpo }
        });

        if (!user) {
           user = await prisma.usuario.create({
             data: {
               cpf: cpfLimpo,
               nome: "Usuário Mock Gov.br",
               perfil_acesso: "ADMIN"
             }
           });
        }

        return { id: user.id, name: user.nome, email: user.email || undefined, role: user.perfil_acesso };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/', // A página de login será a home
  }
});
