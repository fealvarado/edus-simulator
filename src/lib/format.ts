import { EstadoCita, Genero } from "@/generated/prisma/client";

export const ESTADO_LABEL: Record<EstadoCita, string> = {
  Pendiente: "Pendiente",
  En_Atencion: "En atención",
  Finalizada: "Finalizada",
};

export const ESTADO_VARIANT: Record<
  EstadoCita,
  "default" | "secondary" | "outline"
> = {
  Pendiente: "outline",
  En_Atencion: "secondary",
  Finalizada: "default",
};

export const GENERO_LABEL: Record<Genero, string> = {
  Masculino: "Masculino",
  Femenino: "Femenino",
  Otro: "Otro",
};

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("es-CR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-CR", { dateStyle: "medium" }).format(date);
}

export function calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const m = hoy.getMonth() - fechaNacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  return edad;
}
