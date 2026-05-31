"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/constants";
import { EstadoCita } from "@/generated/prisma/client";

export type ActionResult = { ok: boolean; error?: string };

export async function assignCie10(
  clinicalRecordId: number,
  cie10Id: number
): Promise<ActionResult> {
  try {
    const existing = await prisma.codingRecord.findFirst({
      where: { clinical_record_id: clinicalRecordId, cie10_id: cie10Id },
    });
    if (existing) {
      return { ok: false, error: "Este código ya fue asignado al expediente." };
    }

    const clinicalRecord = await prisma.clinicalRecord.findUnique({
      where: { id: clinicalRecordId },
      select: { appointment_id: true },
    });
    if (!clinicalRecord) {
      return { ok: false, error: "Expediente no encontrado." };
    }

    await prisma.$transaction([
      prisma.codingRecord.create({
        data: {
          clinical_record_id: clinicalRecordId,
          cie10_id: cie10Id,
          user_id: CURRENT_USER_ID,
        },
      }),
      // Al codificar, la cita pasa a Finalizada.
      prisma.appointment.update({
        where: { id: clinicalRecord.appointment_id },
        data: { estado: EstadoCita.Finalizada },
      }),
    ]);

    revalidatePath("/");
    revalidatePath(`/citas/${clinicalRecord.appointment_id}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo asignar el código." };
  }
}

export async function removeCoding(codingId: number): Promise<ActionResult> {
  try {
    const coding = await prisma.codingRecord.findUnique({
      where: { id: codingId },
      select: { clinicalRecord: { select: { appointment_id: true } } },
    });
    if (!coding) {
      return { ok: false, error: "Registro de codificación no encontrado." };
    }

    await prisma.codingRecord.delete({ where: { id: codingId } });

    const appointmentId = coding.clinicalRecord.appointment_id;
    revalidatePath("/");
    revalidatePath(`/citas/${appointmentId}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo eliminar el código." };
  }
}
