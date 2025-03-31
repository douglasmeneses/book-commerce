import type { Metadata } from "next";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster"
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
        <Toaster richColors />

        <Footer />
        <Toaster richColors />
      </body>
    </html>
  );
}
