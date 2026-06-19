import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const applications = [
  {
    companyName: "Acme Corp",
    jobTitle: "Frontend Developer",
    jobType: "FULL_TIME",
    status: "INTERVIEWING",
    appliedDate: new Date("2026-05-12"),
    notes: "Phone screen went well, technical round scheduled.",
  },
  {
    companyName: "Globex",
    jobTitle: "Full Stack Engineer",
    jobType: "FULL_TIME",
    status: "APPLIED",
    appliedDate: new Date("2026-05-20"),
    notes: "Applied through company website.",
  },
  {
    companyName: "Initech",
    jobTitle: "React Developer",
    jobType: "PART_TIME",
    status: "OFFER",
    appliedDate: new Date("2026-04-28"),
    notes: "Received offer, reviewing details.",
  },
  {
    companyName: "Umbrella",
    jobTitle: "Software Engineer",
    jobType: "FULL_TIME",
    status: "REJECTED",
    appliedDate: new Date("2026-04-15"),
    notes: "Did not move forward after final round.",
  },
  {
    companyName: "Stark Industries",
    jobTitle: "Frontend Intern",
    jobType: "INTERNSHIP",
    status: "APPLIED",
    appliedDate: new Date("2026-06-01"),
    notes: "Summer internship application.",
  },
];

async function main() {
  await prisma.application.deleteMany();

  for (const application of applications) {
    await prisma.application.create({ data: application });
  }

  console.log("Seeded 5 applications.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
