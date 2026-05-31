import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Activity } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { CURRENT_USER_ID } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EDUS Simulator",
  description:
    "Simulador de Expediente Digital Único en Salud para estudiantes de Registros Médicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-muted/30">
        <header className="border-b bg-background">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Activity className="h-5 w-5" />
              </span>
              <span>
                EDUS <span className="text-muted-foreground">Simulator</span>
              </span>
            </Link>
            <div className="text-sm text-muted-foreground">
              Codificador: <span className="font-medium text-foreground">{CURRENT_USER_ID}</span>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
