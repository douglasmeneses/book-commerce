"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import BookCarousel from "@/components/BookCarousel";
import { Book } from "@/types/bookTypes";
import { getBooks } from "@/services/bookService";
import { favoriteBook } from "@/services/favoriteService";
import { toast } from "sonner";
import { getRecommendations } from "@/services/userServices";
import { set } from "react-hook-form";
import { getUserInLocalStorageItem } from "@/utils/localStorageUtils";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [recomendationsBooks, setRecomendationsBooks] = useState<Array<Book>>(
    []
  );
  const [mostLikedBooks, setMostLikedBooks] = useState<Array<Book>>([]);
  const [mostRecentBooks, setMostRecentBooks] = useState<Array<Book>>([]);

  const handleFavoriteBook = async (book_uuid: string) => {
    try {
      await favoriteBook(book_uuid, user?.uuid || "");
    } catch (error) {
      console.error("Error favoriting book:", error);
    }
  };

  useEffect(() => {
    const storedUser = getUserInLocalStorageItem();
    setUser(storedUser ? JSON.parse(storedUser) : null);

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const mostLiked = await getBooks({ mostLiked: true }, user?.uuid || "");
        setMostLikedBooks(mostLiked);

        const mostRecent = await getBooks(
          { mostRecent: true },
          user?.uuid || ""
        );
        setMostRecentBooks(mostRecent);
        if (user) {
          const recomendations = await getRecommendations(user?.uuid);
          setRecomendationsBooks(recomendations);
        }
      } catch (error) {
        toast.error("Erro ao buscar livros");
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const genres = [
    "Fantasia",
    "Aventura",
    "Romance",
    "Aventura",
    "Tecnologia",
    "Todos",
  ];

  return (
    <>
      <main className="min-h-screen p-40">
        <section className="flex items-center justify-center">
          <div className="flex flex-col">
            <h1 className="font-bold text-4xl">Bem vindo à BookStore</h1>
            <p className="text-xl w-3/4 mt-4 text-[13px] font-semibold">
              Em nossa loja você encontra um livro para todos os gostos. Grande
              variedade. Preços agradáveis. Histórias interessantes.
            </p>
            <Button
              className="w-1/4 text-base mt-4 h-12 bg-[#e67e22] hover:bg-[#d35400] text-white font-semibold transition transform active:scale-95"
              onClick={() => {
                const catalogSection = document.getElementById("catalog");
                if (catalogSection) {
                  catalogSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Veja nosso catálogo
            </Button>
          </div>
          <div className="flex ml-[80px]">
            <Image
              className="relative top-16 z-10 object-fill w-[180px]"
              src="/livro-1.png"
              alt="Livro 1"
              width={200}
              height={200}
            />
            <Image
              className="relative bottom-5 right-10 object-fill w-[250px]"
              src="/livro-2.png"
              alt="Livro 2"
              width={250}
              height={200}
            />
            <Image
              className="relative top-5 right-20 z-10 object-fill w-[180px]"
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
        {user && recomendationsBooks.length > 0 && (
          <section id="catalog" className="flex flex-col pt-40">
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <BookCarousel
                books={recomendationsBooks}
                title={"Recomendados para você"}
                handleFavoriteBook={handleFavoriteBook}
                isLogin={!!user}
              />
            )}
          </section>
        )}
        <section id="catalog" className="flex flex-col pt-40">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <BookCarousel
              books={mostLikedBooks}
              genres={genres}
              title={"Mais curtidos"}
              handleFavoriteBook={handleFavoriteBook}
              isLogin={user ? true : false}
            />
          )}
        </section>
        <section className="flex flex-col mt-20">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <BookCarousel
              books={mostRecentBooks}
              title={"Mais recentes"}
              handleFavoriteBook={handleFavoriteBook}
              isLogin={user ? true : false}
            />
          )}
        </section>
      </main>
    </>
  );
}
