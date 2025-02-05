import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Alert from "@/components/ui/alert";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fish Find",
  description: "Fish Find Inteligencia de Pesca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Alert />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
