import { prisma } from "../config/database";

async function main() {
  const calls = await prisma.verificationCall.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  console.log("LAST 5 VERIFICATION CALLS:");
  console.log(JSON.stringify(calls, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
