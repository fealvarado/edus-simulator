# EDUS Simulator — Expediente Digital Único en Salud

Simulador de Expediente Digital Único en Salud (EDUS) enfocado en estudiantes de Registros Médicos. Permite practicar la codificación CIE-10 a partir de notas clínicas.

## Stack Tecnológico

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Estilos:** Tailwind CSS v4 + shadcn/ui
- **Base de datos:** PostgreSQL
- **ORM:** Prisma

## Requisitos Previos

- Node.js ≥ 20
- PostgreSQL ≥ 14 (corriendo localmente o en Docker)
- npm

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd edus-simulator

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL si difieren del default
```

## Configuración de la Base de Datos

```bash
# 4. Crear la base de datos (si no existe)
createdb edus_simulator
# O desde psql:
# psql -U postgres -c "CREATE DATABASE edus_simulator;"

# 5. Generar el cliente Prisma
npm run db:generate

# 6. Ejecutar migraciones (crea las tablas)
npm run db:migrate

# 7. Poblar la base de datos con datos de prueba
npm run db:seed

# 8. (Opcional) Abrir Prisma Studio para explorar los datos
npm run db:studio
```

### Alternativa con Docker (PostgreSQL)

Si prefieres usar Docker en lugar de una instalación local de PostgreSQL:

```bash
docker run --name edus-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=edus_simulator \
  -p 5432:5432 \
  -d postgres:16-alpine
```

## Scripts Disponibles

| Comando             | Descripción                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Inicia el servidor de desarrollo               |
| `npm run build`     | Construye la aplicación para producción        |
| `npm run start`     | Inicia el servidor de producción               |
| `npm run lint`      | Ejecuta ESLint                                 |
| `npm run db:generate` | Genera el cliente Prisma                     |
| `npm run db:migrate`  | Ejecuta migraciones de Prisma                |
| `npm run db:seed`     | Ejecuta el seed de datos de prueba           |
| `npm run db:reset`    | Resetea la DB y re-ejecuta migraciones+seed  |
| `npm run db:studio`   | Abre Prisma Studio (GUI para explorar datos) |

## Modelo de Datos

```
Patient (1) ──── (N) Appointment (1) ──── (1) ClinicalRecord (1) ──── (N) CodingRecord
                                                                              │
                                                                       Cie10Catalog
```

- **Patient:** Datos demográficos del paciente (DNI, nombre, fecha de nacimiento, género).
- **Appointment:** Citas médicas con estado (Pendiente, En_Atencion, Finalizada).
- **ClinicalRecord:** Notas médicas asociadas a cada cita (1:1).
- **Cie10Catalog:** Catálogo de códigos CIE-10.
- **CodingRecord:** Registro de codificación realizado por un estudiante.

## Datos de Seed

El seed incluye:
- **5 pacientes** de prueba con datos costarricenses.
- **20 códigos CIE-10** representativos y comunes.
- **3 citas** con notas clínicas descriptivas que los estudiantes pueden leer para deducir el código CIE-10 correcto.
