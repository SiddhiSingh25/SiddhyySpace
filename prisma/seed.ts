import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

  if (adminEmail) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "ADMIN" },
      create: {
        email: adminEmail,
        name: "Admin",
        role: "ADMIN",
      },
    });
  }

  const hero = await prisma.hero.findFirst({ where: { isActive: true } });
  if (!hero) {
    await prisma.hero.create({
      data: {
        headline: process.env.NEXT_PUBLIC_SITE_NAME ?? "Siddhyy",
        subheading:
          process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
          "A calm space for thoughtful writing, books, and recommendations.",
        ctaLabel: "Read the latest",
        ctaHref: "/blogs",
        isActive: true,
      },
    });
  }

  const about = await prisma.about.findFirst({ where: { isActive: true } });
  if (!about) {
    await prisma.about.create({
      data: {
        title: "About",
        biography:
          "This is a calm space for writing, recommendations, and documenting the journey — quietly and with care.",
        isActive: true,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
