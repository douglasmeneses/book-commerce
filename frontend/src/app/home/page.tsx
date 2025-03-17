"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getBooks } from "@/services/bookService";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Book } from "@/types/index";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [mostLikedBooks, setMostLikedBooks] = useState<Array<Book>>([]);
  const [mostRecentBooks, setMostRecentBooks] = useState<Array<Book>>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const allBooks = await getBooks();

        if (Array.isArray(allBooks)) {
          const mostLikedBooks = [...allBooks].sort(
            (a, b) => b.favorite_count - a.favorite_count
          );
          setMostLikedBooks(mostLikedBooks);

          const mostRecentBooks = [...allBooks].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          setMostRecentBooks(mostRecentBooks);
        }
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <main className="min-h-screen p-40">
        <section className="flex flex-col mt-40">
          <ul className="flex mt-2 gap-10">
            <h1 className="font-bold text-2xl w-2/6 mr-10 leading-none">
              Mais curtidos
            </h1>
            <li className="text-sm font-light hover:text-[#e67e22] cursor-pointer">
              Fantasia
            </li>
            <li className="text-sm font-light hover:text-[#e67e22] cursor-pointer">
              Auto-ajuda
            </li>
            <li className="text-sm font-light hover:text-[#e67e22] cursor-pointer">
              Romance
            </li>
            <li className="text-sm font-light hover:text-[#e67e22] cursor-pointer">
              Ficção
            </li>
            <li className="text-sm font-light hover:text-[#e67e22] cursor-pointer">
              Investigação
            </li>
            <li className="text-sm font-light hover:text-[#e67e22] cursor-pointer">
              Outros
            </li>
          </ul>
          <div className="mt-10 flex justify-center">
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="p-5">
                  {mostLikedBooks.map((book) => (
                    <CarouselItem
                      key={book.id}
                      className="md:basis-1/4 lg:basis-1/5"
                    >
                      <div className="">
                        <Card className="h-full border shadow-sm overflow-hidden mx-10">
                          <CardContent className="flex flex-col items-center justify-center">
                            <div className="w-full flex justify-center bg-white p-5">
                              <Image
                                src={
                                  typeof book.image === "string"
                                    ? book.image
                                    : "/book.png"
                                }
                                alt={book.title}
                                width={150}
                                height={150}
                              />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <p className="font-bold text-base">{`R$ ${book.price.replace(
                                ".",
                                ","
                              )}`}</p>
                              <p className="text-sm line-clamp-1 font-bold">
                                {book.title}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-1">
                                {book.authors.map((author, index) => (
                                  <span key={index}>
                                    {author.author.name}{" "}
                                    {index < book.authors.length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                              </p>
                              <div className="flex gap-2 items-center mt-2">
                                <Button className="text-xs h-8 bg-[#e67e22] hover:bg-[#d35400] text-white font-semibold rounded-sm">
                                  Adicionar
                                </Button>
                                <FavoriteBorderIcon
                                  className="text-[#e67e22] cursor-pointer"
                                  fontSize="large"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 bg-white border shadow-md" />
                <CarouselNext className="right-0 bg-white border shadow-md" />
              </Carousel>
            )}
          </div>
        </section>

        <section className="flex flex-col mt-40">
          <h1 className="font-bold text-2xl leading-none mt-10 w-full text-center">
            Mais recentes
          </h1>
          <div className="mt-10 flex justify-center">
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="p-5">
                  {mostRecentBooks.map((book) => (
                    <CarouselItem
                      key={book.id}
                      className="md:basis-1/4 lg:basis-1/5"
                    >
                      <div className="">
                        <Card className="h-full border shadow-sm overflow-hidden mx-10">
                          <CardContent className="flex flex-col items-center justify-center">
                            <div className="w-full flex justify-center bg-white p-5">
                              <Image
                                src={
                                  typeof book.image === "string"
                                    ? book.image
                                    : "/book.png"
                                }
                                alt={book.title}
                                width={150}
                                height={150}
                              />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <p className="font-bold text-base">{`R$ ${book.price.replace(
                                ".",
                                ","
                              )}`}</p>
                              <p className="text-sm line-clamp-1 font-bold">
                                {book.title}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-1">
                                {book.authors.map((author, index) => (
                                  <span key={index}>
                                    {author.author.name}{" "}
                                    {index < book.authors.length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                              </p>
                              <div className="flex gap-2 items-center mt-2">
                                <Button className="text-xs h-8 bg-[#e67e22] hover:bg-[#d35400] text-white font-semibold rounded-sm">
                                  Adicionar
                                </Button>
                                <FavoriteBorderIcon
                                  className="text-[#e67e22] cursor-pointer"
                                  fontSize="large"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 bg-white border shadow-md" />
                <CarouselNext className="right-0 bg-white border shadow-md" />
              </Carousel>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
