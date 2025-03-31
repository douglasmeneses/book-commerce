"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getBooks } from "@/services/bookService";
import Image from "next/image";
import NavBar from "@/components/NavBar";
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
        console.log("Erro ao buscar livros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
        <section id="catalog" className="flex flex-col pt-40">
          <ul className="flex mt-2 gap-10">
            <h1 className="font-bold text-2xl w-2/6 ml-10 leading-none">
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
                <CarouselContent>
                  {mostLikedBooks.map((book) => (
                    <CarouselItem
                      key={book.id}
                      className="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5 flex justify-center align-middle"
                    >
                      <div className="">
                        <Card className=" border shadow-sm overflow-hidden mx-10">
                          <CardContent className="flex flex-col items-center justify-center">
                            <div className="w-full flex justify-center bg-white my-5">
                              <Image
                                src={book.image_url}
                                alt={book.title}
                                width={150}
                                height={200}
                                className="object-cover w-[150px] h-[200px]"
                              />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <p className="font-bold text-base">{`R$ ${parseFloat(
                                book.price
                              )
                                .toFixed(2)
                                .replace(".", ",")}`}</p>
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
                                  fontSize="medium"
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

        <section className="flex flex-col mt-20">
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
                <CarouselContent>
                  {mostRecentBooks.map((book) => (
                    <CarouselItem
                      key={book.id}
                      className="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5 flex justify-center align-middle"
                    >
                      <div className="">
                        <Card className=" border shadow-sm overflow-hidden mx-10">
                          <CardContent className="flex flex-col items-center justify-center">
                            <div className="w-full flex justify-center bg-white my-5">
                              <Image
                                src={book.image_url}
                                alt={book.title}
                                width={150}
                                height={200}
                                className="object-cover w-[150px] h-[200px]"
                              />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <p className="font-bold text-base">{`R$ ${parseFloat(
                                book.price
                              )
                                .toFixed(2)
                                .replace(".", ",")}`}</p>
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
                                  fontSize="medium"
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
