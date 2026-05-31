import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAppointmentDetail, searchCie10 } from "@/lib/data";
import {
  ESTADO_LABEL,
  ESTADO_VARIANT,
  GENERO_LABEL,
  calcularEdad,
  formatDate,
  formatDateTime,
} from "@/lib/format";
import { Cie10Coder } from "./cie10-coder";

export default async function CitaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointmentId = Number(id);
  if (Number.isNaN(appointmentId)) {
    notFound();
  }

  const [cita, catalog] = await Promise.all([
    getAppointmentDetail(appointmentId),
    searchCie10(""),
  ]);

  if (!cita) {
    notFound();
  }

  const { patient, clinicalRecord } = cita;

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la bandeja
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {patient.nombre} {patient.apellidos}
          </h1>
          <p className="text-muted-foreground">Expediente clínico de la cita</p>
        </div>
        <Badge variant={ESTADO_VARIANT[cita.estado]} className="text-sm">
          {ESTADO_LABEL[cita.estado]}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nota médica</CardTitle>
              <CardDescription>
                Lee la nota para deducir el diagnóstico y asignar el código
                CIE-10.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clinicalRecord ? (
                <p className="whitespace-pre-line leading-relaxed">
                  {clinicalRecord.notas_medicas}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Esta cita no tiene expediente clínico asociado.
                </p>
              )}
            </CardContent>
          </Card>

          {clinicalRecord && (
            <Cie10Coder
              clinicalRecordId={clinicalRecord.id}
              catalog={catalog}
              assigned={clinicalRecord.codingRecords.map((c) => ({
                id: c.id,
                cie10Id: c.cie10_id,
                codigo: c.cie10.codigo,
                descripcion: c.cie10.descripcion,
                userId: c.user_id,
                fecha: c.fecha_codificacion,
              }))}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Datos del paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Field label="DNI" value={patient.dni} />
              <Separator />
              <Field
                label="Edad"
                value={`${calcularEdad(patient.fecha_nacimiento)} años`}
              />
              <Separator />
              <Field
                label="Fecha de nacimiento"
                value={formatDate(patient.fecha_nacimiento)}
              />
              <Separator />
              <Field label="Género" value={GENERO_LABEL[patient.genero]} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="h-4 w-4" />
                Datos de la cita
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Field label="Fecha y hora" value={formatDateTime(cita.fecha_hora)} />
              <Separator />
              <Field label="Estado" value={ESTADO_LABEL[cita.estado]} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
