import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

// Evita várias instâncias do Prisma em ambiente de dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@email.com" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null;
        
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.senha) return null;

        const isValid = await bcrypt.compare(credentials.senha as string, user.senha);

        if (!isValid) return null;

        return { 
          id: user.id, 
          name: user.nome, 
          email: user.email, 
          role: user.perfil_acesso 
        };
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
    signIn: '/',
  }
});
