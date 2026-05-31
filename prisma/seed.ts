import "dotenv/config";
import { PrismaClient, Genero, EstadoCita } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── 1. Patients ─────────────────────────────────────────────────
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        dni: "101230456",
        nombre: "María",
        apellidos: "González Ramírez",
        fecha_nacimiento: new Date("1985-03-15"),
        genero: Genero.Femenino,
      },
    }),
    prisma.patient.create({
      data: {
        dni: "203450678",
        nombre: "Carlos",
        apellidos: "Hernández Mora",
        fecha_nacimiento: new Date("1972-07-22"),
        genero: Genero.Masculino,
      },
    }),
    prisma.patient.create({
      data: {
        dni: "304560789",
        nombre: "Ana",
        apellidos: "Vargas Solano",
        fecha_nacimiento: new Date("1990-11-08"),
        genero: Genero.Femenino,
      },
    }),
    prisma.patient.create({
      data: {
        dni: "405670890",
        nombre: "José",
        apellidos: "Pérez Castillo",
        fecha_nacimiento: new Date("1968-01-30"),
        genero: Genero.Masculino,
      },
    }),
    prisma.patient.create({
      data: {
        dni: "506780901",
        nombre: "Lucía",
        apellidos: "Rojas Jiménez",
        fecha_nacimiento: new Date("2000-06-12"),
        genero: Genero.Femenino,
      },
    }),
  ]);

  console.log(`  ✔ ${patients.length} patients created`);

  // ─── 2. CIE-10 Catalog (20 common codes) ─────────────────────────
  const cie10Data = [
    { codigo: "J06.9", descripcion: "Infección aguda de las vías respiratorias superiores, no especificada" },
    { codigo: "J01.9", descripcion: "Sinusitis aguda, no especificada" },
    { codigo: "J18.9", descripcion: "Neumonía, no especificada" },
    { codigo: "J45.9", descripcion: "Asma, no especificada" },
    { codigo: "I10",   descripcion: "Hipertensión esencial (primaria)" },
    { codigo: "E11.9", descripcion: "Diabetes mellitus tipo 2, sin complicaciones" },
    { codigo: "K29.7", descripcion: "Gastritis, no especificada" },
    { codigo: "N39.0", descripcion: "Infección de vías urinarias, sitio no especificado" },
    { codigo: "M54.5", descripcion: "Lumbago no especificado (dolor lumbar)" },
    { codigo: "R51",   descripcion: "Cefalea" },
    { codigo: "B34.9", descripcion: "Infección viral, no especificada" },
    { codigo: "K21.0", descripcion: "Enfermedad por reflujo gastroesofágico con esofagitis" },
    { codigo: "J02.9", descripcion: "Faringitis aguda, no especificada" },
    { codigo: "L30.9", descripcion: "Dermatitis, no especificada" },
    { codigo: "R50.9", descripcion: "Fiebre, no especificada" },
    { codigo: "A09",   descripcion: "Diarrea y gastroenteritis de presunto origen infeccioso" },
    { codigo: "E78.5", descripcion: "Hiperlipidemia, no especificada" },
    { codigo: "F32.9", descripcion: "Episodio depresivo, no especificado" },
    { codigo: "G43.9", descripcion: "Migraña, no especificada" },
    { codigo: "J20.9", descripcion: "Bronquitis aguda, no especificada" },
  ];

  const cie10Records = await Promise.all(
    cie10Data.map((item) => prisma.cie10Catalog.create({ data: item }))
  );

  console.log(`  ✔ ${cie10Records.length} CIE-10 catalog entries created`);

  // ─── 3. Appointments + Clinical Records ──────────────────────────
  await prisma.appointment.create({
    data: {
      patient_id: patients[0].id,
      fecha_hora: new Date("2025-06-10T08:30:00"),
      estado: EstadoCita.Finalizada,
      clinicalRecord: {
        create: {
          notas_medicas:
            "Paciente femenina de 40 años acude por cuadro de 3 días de evolución " +
            "con congestión nasal, rinorrea purulenta, dolor facial en región maxilar " +
            "bilateral y cefalea frontal. Refiere fiebre de 38.2°C. A la exploración " +
            "se observa dolor a la palpación de senos paranasales. Se indica " +
            "tratamiento con amoxicilina 500 mg cada 8 horas por 7 días y " +
            "descongestionante nasal.",
        },
      },
    },
  });

  await prisma.appointment.create({
    data: {
      patient_id: patients[1].id,
      fecha_hora: new Date("2025-06-11T10:00:00"),
      estado: EstadoCita.Finalizada,
      clinicalRecord: {
        create: {
          notas_medicas:
            "Paciente masculino de 53 años con antecedentes de hipertensión arterial " +
            "y diabetes mellitus tipo 2 en control irregular. Acude a control rutinario. " +
            "PA: 155/95 mmHg. Glicemia en ayunas: 180 mg/dL. HbA1c: 8.2%. " +
            "Se ajusta tratamiento: metformina 850 mg cada 12 horas, " +
            "losartán 50 mg cada 12 horas. Se refuerza educación sobre dieta " +
            "y ejercicio. Se solicita perfil lipídico de control.",
        },
      },
    },
  });

  await prisma.appointment.create({
    data: {
      patient_id: patients[2].id,
      fecha_hora: new Date("2025-06-12T14:00:00"),
      estado: EstadoCita.En_Atencion,
      clinicalRecord: {
        create: {
          notas_medicas:
            "Paciente femenina de 34 años consulta por dolor en epigastrio de " +
            "2 semanas de evolución, tipo ardor, que empeora con las comidas y " +
            "se acompaña de náuseas ocasionales y sensación de reflujo ácido. " +
            "Niega vómitos, melena o pérdida de peso. Antecedente de uso frecuente " +
            "de AINES por cefaleas. A la exploración: abdomen blando, depresible, " +
            "dolor a la palpación profunda en epigastrio. Se indica omeprazol " +
            "20 mg en ayunas por 4 semanas y se suspenden AINES.",
        },
      },
    },
  });

  console.log("  ✔ 3 appointments with clinical records created");

  console.log("\n✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
