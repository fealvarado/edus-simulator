import Link from "next/link";
import { ArrowRight, FileText, Stethoscope } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAppointments } from "@/lib/data";
import {
  ESTADO_LABEL,
  ESTADO_VARIANT,
  formatDateTime,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const appointments = await getAppointments();

  const pendientes = appointments.filter(
    (a) => a.estado !== "Finalizada"
  ).length;
  const codificadas = appointments.filter(
    (a) => (a.clinicalRecord?._count.codingRecords ?? 0) > 0
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bandeja de trabajo</h1>
        <p className="text-muted-foreground">
          Citas con expediente listas para codificar según el catálogo CIE-10.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de citas</CardDescription>
            <CardTitle className="text-3xl">{appointments.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <Stethoscope className="mr-1 inline h-4 w-4" />
            Con expediente clínico
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pendientes de cierre</CardDescription>
            <CardTitle className="text-3xl">{pendientes}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Aún no finalizadas
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Con código asignado</CardDescription>
            <CardTitle className="text-3xl">{codificadas}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <FileText className="mr-1 inline h-4 w-4" />
            Al menos un CIE-10
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Citas</CardTitle>
          <CardDescription>
            Selecciona una cita para abrir el expediente y codificar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Fecha y hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Códigos</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((cita) => {
                const codigos =
                  cita.clinicalRecord?._count.codingRecords ?? 0;
                return (
                  <TableRow key={cita.id}>
                    <TableCell className="font-medium">
                      {cita.patient.nombre} {cita.patient.apellidos}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {cita.patient.dni}
                    </TableCell>
                    <TableCell>{formatDateTime(cita.fecha_hora)}</TableCell>
                    <TableCell>
                      <Badge variant={ESTADO_VARIANT[cita.estado]}>
                        {ESTADO_LABEL[cita.estado]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {codigos > 0 ? (
                        <Badge variant="secondary">{codigos}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/citas/${cita.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Abrir expediente
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {appointments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No hay citas registradas. Ejecuta el seed con{" "}
                    <code>npm run db:seed</code>.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
