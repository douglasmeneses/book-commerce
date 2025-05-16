"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getBooks } from "@/services/bookService";
import { Book, Filter } from "@/types/bookTypes";
import { Button } from "@/components/ui/button";
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
import { favoriteBook } from "@/services/favoriteService";
import FavoriteButton from "@/components/FavoriteButton";
import { LoaderCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserInLocalStorageItem } from "@/utils/localStorageUtils";

function SearchContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<Array<Book>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const storedUser = getUserInLocalStorageItem();
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const user_uuid: string = user ? user.uuid : "";

  useEffect(() => {
    if (!query) {
      return router.replace("/");
    }

    const fetchBooks = async () => {
      const filter: Filter = {
        search: query || "",
        page: currentPage,
        limit: itemsPerPage,
      };
      try {
        setLoading(true);
        const books = await getBooks(filter, user_uuid);
        setBooks(books);

        const nextPageFilter: Filter = {
          search: query || "",
          page: currentPage + 1,
          limit: itemsPerPage,
        };
        const nextPageBooks = await getBooks(nextPageFilter, user_uuid);

        if (nextPageBooks.length > 0) {
          setTotalPages(currentPage + 1);
        } else {
          setTotalPages(currentPage);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Erro ao buscar livros.");
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };

    fetchBooks();
  }, [query, currentPage, user_uuid]);

  const handleFavoriteBook = async (book_uuid: string) => {
    try {
      await favoriteBook(book_uuid, user_uuid);
    } catch (error) {
      console.error("Error favoriting book:", error);
    }
  };

  const handleAddToCart = async (bookId: string) => {
    try {
      if (!user_uuid) {
        toast.error(
          "Você precisa estar logado para adicionar livros ao carrinho."
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }
      const response = await addItemToCart(user_uuid, String(bookId), 1);

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
        Resultados de:{" "}
        <span className="text-orange-500">{`"${
          loading ? "..." : query
        }"`}</span>
      </h1>
      <section className="min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <LoaderCircle className="animate-spin text-orange-500" size={48} />
          </div>
        ) : books.length === 0 ? (
          <p className="text-gray-600">Nenhum livro encontrado.</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Exibindo resultados para sua busca...
            </p>

            {books.map((book) => (
              <div
                key={book.uuid}
                className="flex p-5 mb-10 bg-white rounded shadow-md cursor-pointer"
                onClick={() => router.push(`/book/${book.uuid}`)}
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
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {book.authors.join(", ")}
                    </p>

                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, index) => {
                        const rating = parseFloat(book.rating);
                        const isFullStar = index < Math.floor(rating);
                        const isHalfStar =
                          index === Math.floor(rating) && rating % 1 !== 0;

                        return (
                          <TooltipProvider key={index} delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger>
                                {isFullStar ? (
                                  <StarIcon className="text-yellow-400" />
                                ) : isHalfStar ? (
                                  <StarHalfIcon className="text-yellow-400" />
                                ) : (
                                  <StarBorderIcon className="text-yellow-400" />
                                )}
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#e67e22] text-white rounded-sm font-bold">
                                <span>{`${parseFloat(book.rating).toFixed(
                                  1
                                )} de 5.0`}</span>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                    <FavoriteButton
                      book_uuid={book.uuid}
                      favorite={book.favorites}
                      handleFavoriteBook={handleFavoriteBook}
                      isLogin={user ? true : false}
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <LoaderCircle className="animate-spin text-orange-500" size={48} />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
