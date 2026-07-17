import { prisma } from "./lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@examfacile.ga",
      passwordHash: "hash_temporaire",
      subscription: {
        create: { plan: "FREE", status: "ACTIVE" },
      },
    },
    include: { subscription: true },
  });
  console.log("Utilisateur créé :", user);

  const users = await prisma.user.findMany({
    include: { subscription: true },
  });
  console.log("Tous les utilisateurs :", JSON.stringify(users, null, 2));
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });