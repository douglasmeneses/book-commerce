"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getBooks } from "@/services/bookService";
import { Book, Filter } from "@/types/bookTypes";
import { Button } from "@/components/ui/button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import Image from "next/image";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { addItemToCart } from "@/services/cartService";

export default function SearchPage() {
  const [books, setBooks] = useState<Array<Book>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchBooks = async () => {
      const filter: Filter = {
        search: query || "",
        page: currentPage,
        limit: itemsPerPage,
      };
      try {
        const books = await getBooks(filter);
        setBooks(books);

        const nextPageFilter: Filter = {
          search: query || "",
          page: currentPage + 1,
          limit: itemsPerPage,
        };
        const nextPageBooks = await getBooks(nextPageFilter);

        if (nextPageBooks.length > 0) {
          setTotalPages(currentPage + 1);
        } else {
          setTotalPages(currentPage);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Erro ao buscar livros.");
        }
      }
    };

    fetchBooks();
  }, [query, currentPage]);
  const handleAddToCart = async (bookId: string) => {
    try {
      const userUUID = "20cfe17a-adb9-4095-9cdd-b54900b52576";
      const quantity = 1;

      const response = await addItemToCart(userUUID, String(bookId), quantity);

      if (typeof response === "string") {
        throw new Error(response);
      }

      toast.success("Livro adicionado ao carrinho com sucesso!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Erro ao adicionar livro ao carrinho.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Resultados de: <span className="text-orange-500">{`"${query}"`}</span>
      </h1>
      <section className="min-h-screen">
        {books.length === 0 ? (
          <p className="text-gray-600">Nenhum livro encontrado.</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Exibindo resultados para sua busca...
            </p>

            {books.map((book) => (
              <div
                key={book.id}
                className="flex p-5 mb-10 bg-white rounded shadow-md cursor-pointer"
              >
                <Image
                  src={book.image_url || "/book-placeholder.png"}
                  width={200}
                  height={300}
                  alt={book.title}
                  className="h-64 w-[200px] object-cover"
                />
                <div className="ml-4 flex flex-col justify-between">
                  <div className="flex flex-col gap-3">
                    <h2 className="text-lg font-bold">{book.title}</h2>
                    <p className="text-gray-600">
                      {book.authors.map((author, index) => (
                        <span key={index}>
                          {author.author.name}{" "}
                          {index < book.authors.length - 1 ? ", " : " "}
                        </span>
                      ))}
                    </p>

                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, index) => {
                        const rating = parseFloat(book.rating);
                        const isFullStar = index < Math.floor(rating);
                        const isHalfStar =
                          index === Math.floor(rating) && rating % 1 !== 0;

                        if (isFullStar) {
                          return (
                            <StarIcon key={index} className="text-yellow-400" />
                          );
                        }

                        if (isHalfStar) {
                          return (
                            <StarHalfIcon
                              key={index}
                              className="text-yellow-400"
                            />
                          );
                        }

                        return (
                          <StarBorderIcon
                            key={index}
                            className="text-yellow-400"
                          />
                        );
                      })}
                    </div>

                    <p className="font-bold text-2xl">{`R$${parseFloat(
                      book.price
                    ).toFixed(2)}`}</p>
                    <p className="w-2/3 line-clamp-2">{book.synopsis}</p>
                  </div>

                  <div className="flex gap-2 items-center mt-2">
                    <Button
                      className="text-xs h-8 bg-[#e67e22] hover:bg-[#d35400] text-white font-semibold rounded-sm"
                      onClick={() => handleAddToCart(book.uuid)}
                    >
                      Adicionar
                    </Button>
                    <FavoriteBorderIcon
                      className="text-[#e67e22] cursor-pointer"
                      fontSize="medium"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Pagination className="mt-8 flex">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "cursor-not-allowed px-10 mx-2 text-gray-400 hover:text-gray-400"
                        : "px-10 mx-2 cursor-pointer"
                    }
                  >
                    Anterior
                  </PaginationLink>
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationLink
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage((prev) => prev + 1);
                      }
                    }}
                    className={
                      currentPage >= totalPages
                        ? "cursor-not-allowed px-10 mx-2 text-gray-400 hover:text-gray-400"
                        : "px-10 mx-2 cursor-pointer"
                    }
                  >
                    Próximo
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
    </div>
  );
}
