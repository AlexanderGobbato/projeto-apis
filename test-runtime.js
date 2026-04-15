const { PrismaClient } = require("@prisma/client");
try {
  const client = new PrismaClient({ url: process.env.DATABASE_URL });
  console.log("Success with url");
} catch(e) {
  console.log("Failed with url", e.message.split('\n')[0]);
}

try {
  const client2 = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
  console.log("Success with datasourceUrl");
} catch(e) {
  console.log("Failed with datasourceUrl", e.message.split('\n')[0]);
}

try {
  const client3 = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
  console.log("Success with datasources");
} catch(e) {
  console.log("Failed with datasources", e.message.split('\n')[0]);
}
