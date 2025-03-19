"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen p-40">
        <section className="flex items-center justify-center">
          <div className="flex flex-col">
            <h1 className="font-bold text-4xl">Bem vindo à BookStore</h1>
            <p className="font-light text-xl w-3/4 mt-4 text-[13px] font-semibold w-[350px]">
              Em nossa loja você encontra um livro para todos os gostos. Grande
              variedade. Preços agradáveis. Histórias interessantes.
            </p>
            <Button className="w-1/4 text-base mt-4 h-12 bg-[#e67e22] hover:bg-[#d35400] text-white font-semibold px-[100px]">
              Veja nosso catálogo
            </Button>
          </div>
          <div className="flex ml-[80px]">
            <Image
              className="relative top-16 z-10"
              src="/livro-1.png"
              alt="Livro 1"
              width={200}
              height={200}
            />
            <Image
              className="relative bottom-5 right-10"
              src="/livro-2.png"
              alt="Livro 2"
              width={250}
              height={200}
            />
            <Image
              className="relative top-5 right-20 z-10"
              src="/livro-3.png"
              alt="Livro 3"
              width={200}
              height={200}
            />
            <Image
              className="relative top-24 right-28 z-10 h-3/4"
              src="/livro-4.png"
              alt="Livro 4"
              width={150}
              height={200}
            />
          </div>
        </section>
      </main>
    </>
  );
}
