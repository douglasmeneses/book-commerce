import type { Metadata } from "next";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Toaster as ToasterUI } from "@/components/ui/toaster";
import { Toaster as ToastSonner } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-commerce",
  description: "E-commerce de livros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
        <ToasterUI />
        <ToastSonner richColors />
        <Footer />
      </body>
    </html>
  );
}
