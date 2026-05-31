"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { assignCie10, removeCoding } from "@/lib/actions";
import { formatDateTime } from "@/lib/format";

type CatalogItem = {
  id: number;
  codigo: string;
  descripcion: string;
};

type AssignedItem = {
  id: number;
  cie10Id: number;
  codigo: string;
  descripcion: string;
  userId: string;
  fecha: Date;
};

export function Cie10Coder({
  clinicalRecordId,
  catalog,
  assigned,
}: {
  clinicalRecordId: number;
  catalog: CatalogItem[];
  assigned: AssignedItem[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<number | null>(null);

  const assignedIds = useMemo(
    () => new Set(assigned.map((a) => a.cie10Id)),
    [assigned]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (c) =>
        c.codigo.toLowerCase().includes(q) ||
        c.descripcion.toLowerCase().includes(q)
    );
  }, [catalog, query]);

  function handleAssign(cie10Id: number) {
    setActiveId(cie10Id);
    startTransition(async () => {
      const res = await assignCie10(clinicalRecordId, cie10Id);
      setActiveId(null);
      if (res.ok) {
        toast.success("Código CIE-10 asignado.");
        router.refresh();
      } else {
        toast.error(res.error ?? "No se pudo asignar el código.");
      }
    });
  }

  function handleRemove(codingId: number) {
    setActiveId(codingId);
    startTransition(async () => {
      const res = await removeCoding(codingId);
      setActiveId(null);
      if (res.ok) {
        toast.success("Código eliminado.");
        router.refresh();
      } else {
        toast.error(res.error ?? "No se pudo eliminar el código.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Codificación CIE-10</CardTitle>
        <CardDescription>
          Asigna uno o más códigos del catálogo según la nota médica.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <h3 className="mb-2 text-sm font-medium">
            Códigos asignados ({assigned.length})
          </h3>
          {assigned.length === 0 ? (
            <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
              Aún no se ha asignado ningún código a este expediente.
            </p>
          ) : (
            <ul className="space-y-2">
              {assigned.map((a) => (
                <li
                  key={a.id}
                  className="flex items-start justify-between gap-3 rounded-md border bg-background p-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Badge className="font-mono">{a.codigo}</Badge>
                      <span className="text-sm font-medium">
                        {a.descripcion}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Codificado por {a.userId} · {formatDateTime(a.fecha)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Eliminar ${a.codigo}`}
                    disabled={pending && activeId === a.id}
                    onClick={() => handleRemove(a.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 text-sm font-medium">Buscar en el catálogo</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por código o descripción (ej. J01, sinusitis)"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <ul className="mt-3 max-h-80 space-y-1 overflow-y-auto pr-1">
            {results.map((c) => {
              const yaAsignado = assignedIds.has(c.id);
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-md border p-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {c.codigo}
                    </Badge>
                    <span className="truncate text-sm">{c.descripcion}</span>
                  </div>
                  {yaAsignado ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Check className="h-4 w-4" />
                      Asignado
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="shrink-0"
                      disabled={pending && activeId === c.id}
                      onClick={() => handleAssign(c.id)}
                    >
                      <Plus className="h-4 w-4" />
                      Asignar
                    </Button>
                  )}
                </li>
              );
            })}
            {results.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">
                Sin resultados para “{query}”.
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
