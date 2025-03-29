import type { Metadata } from "next";
import Footer from "@/components/Footer";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
        {children}
        <Toaster richColors />
        <Footer />
      </body>
    </html>
  );
}
