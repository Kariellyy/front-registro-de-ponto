import { ClientProviders } from "@/providers/ClientProviders";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Registro de Ponto",
  description: "Sistema de controle de ponto eletrônico para empresas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Buscar a chave da API no servidor (não exposta no bundle do cliente)
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders googleMapsApiKey={googleMapsApiKey}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
