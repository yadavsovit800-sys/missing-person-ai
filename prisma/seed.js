const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('?? Starting database seeding...');

  // Clear existing records to avoid duplicate IDs during re-seeding
  await prisma.sightingReport.deleteMany({});
  await prisma.missingPerson.deleteMany({});
  await prisma.alertBroadcast.deleteMany({});

  // Sample Cases Data
  const sampleCases = [
    {
      fullName: "Sophia Martinez",
      age: 14,
      gender: "Female",
      lastSeenLoc: "Central Bus Station, Bay 4",
      lastSeenCoords: "37.7749,-122.4194",
      dateMissing: new Date("2026-10-18T14:30:00Z"),
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      contactPhone: "+1 (555) 234-5678",
      status: "ACTIVE",
      faceVector: "0.124,0.892,0.341,0.512"
    },
    {
      fullName: "Marcus Vance",
      age: 34,
      gender: "Male",
      lastSeenLoc: "Westside Community Park",
      lastSeenCoords: "37.7833,-122.4167",
      dateMissing: new Date("2026-10-15T09:15:00Z"),
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      contactPhone: "+1 (555) 492-1092",
      status: "ACTIVE",
      faceVector: "0.451,0.221,0.981,0.104"
    },
    {
      fullName: "Elena Rostova",
      age: 22,
      gender: "Female",
      lastSeenLoc: "Metro Line 3, North Terminal",
      lastSeenCoords: "37.7651,-122.4201",
      dateMissing: new Date("2026-10-20T18:45:00Z"),
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      contactPhone: "+1 (555) 019-2831",
      status: "ACTIVE",
      faceVector: "0.781,0.312,0.119,0.884"
    },
    {
      fullName: "David Chen",
      age: 68,
      gender: "Male",
      lastSeenLoc: "Pine Street Medical Plaza",
      lastSeenCoords: "37.7910,-122.4021",
      dateMissing: new Date("2026-10-10T11:00:00Z"),
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      contactPhone: "+1 (555) 883-1122",
      status: "FOUND",
      faceVector: "0.229,0.551,0.672,0.910"
    },
    {
      fullName: "Aaliyah Patel",
      age: 17,
      gender: "Female",
      lastSeenLoc: "Oakridge High School Library",
      lastSeenCoords: "37.7512,-122.4310",
      dateMissing: new Date("2026-10-05T16:00:00Z"),
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      contactPhone: "+1 (555) 741-9988",
      status: "FOUND",
      faceVector: "0.901,0.112,0.334,0.721"
    }
  ];

  for (const c of sampleCases) {
    const createdCase = await prisma.missingPerson.create({ data: c });
    console.log(`? Created Case: ${createdCase.fullName} [${createdCase.status}]`);
  }

  // Create sample sighting report linked to Sophia Martinez
  const sophia = await prisma.missingPerson.findFirst({ where: { fullName: "Sophia Martinez" } });
  if (sophia) {
    await prisma.sightingReport.create({
      data: {
        missingPersonId: sophia.id,
        location: "Grand Avenue Coffee Shop",
        sightingCoords: "37.7755,-122.4180",
        photoUrl: sophia.photoUrl,
        matchConfidence: 96.8,
        reporterContact: "+1 (555) 901-4433"
      }
    });
    console.log(`??? Created Sighting Report for ${sophia.fullName}`);
  }

  console.log('\n?? Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('? Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
