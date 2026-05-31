import { prisma } from "@/lib/prisma";

export async function getAppointments() {
  return prisma.appointment.findMany({
    orderBy: { fecha_hora: "asc" },
    include: {
      patient: true,
      clinicalRecord: {
        include: {
          _count: { select: { codingRecords: true } },
        },
      },
    },
  });
}

export async function getAppointmentDetail(id: number) {
  return prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      clinicalRecord: {
        include: {
          codingRecords: {
            orderBy: { fecha_codificacion: "desc" },
            include: { cie10: true },
          },
        },
      },
    },
  });
}

export async function searchCie10(query: string) {
  const q = query.trim();
  return prisma.cie10Catalog.findMany({
    where: q
      ? {
          OR: [
            { codigo: { contains: q, mode: "insensitive" } },
            { descripcion: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { codigo: "asc" },
    take: 50,
  });
}
