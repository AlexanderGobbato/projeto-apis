"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", Object.fromEntries(formData)); // Next-auth accepts FormData or object
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciais inválidas. Verifique seu e-mail e senha.";
        default:
          return "Ocorreu um erro inesperado na autenticação.";
      }
    }
    // Required to throw for redirects to work
    throw error;
  }
}
