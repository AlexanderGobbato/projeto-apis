const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const emailAdmin = "alexandergobbato@apoioprodesp.sp.gov.br";
  const senhaPlana = "admin";
  const hashSenha = await bcrypt.hash(senhaPlana, 10);

  const existingUser = await prisma.usuario.findUnique({
    where: { email: emailAdmin }
  });

  if (existingUser) {
    console.log("Admin já existe! Vamos atualizar a senha dele.");
    await prisma.usuario.update({
      where: { email: emailAdmin },
      data: { senha: hashSenha, perfil_acesso: "ADMIN" }
    });
    console.log("Admin atualizado com sucesso!");
  } else {
    console.log("Criando novo usuário Admin...");
    await prisma.usuario.create({
      data: {
        cpf: "00000000000",
        nome: "Alexander Gobbato",
        email: emailAdmin,
        senha: hashSenha,
        perfil_acesso: "ADMIN"
      }
    });
    console.log("Admin criado com sucesso!");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
