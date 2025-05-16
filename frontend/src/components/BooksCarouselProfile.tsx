import React, { useEffect, useState } from "react";
import { Book } from "@/types/bookTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import FavoriteButton from "./FavoriteButton";
import { useRouter } from "next/navigation";
import { addItemToCart } from "@/services/cartService";
import { getUserInLocalStorageItem } from "@/utils/localStorageUtils";

interface BookCarouselProps {
  books: Array<Book>;
  handleFavoriteBook: (book_uuid: string) => void;
  isLogin: boolean;
}

export default function BooksPerfilCarousel({
  books,
  handleFavoriteBook,
  isLogin,
}: BookCarouselProps) {
  const [Loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAddToCart = async (bookId: string) => {
    try {
      const user = getUserInLocalStorageItem();
      const user_uuid: string = user ? JSON.parse(user).uuid : "";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const isBooksArray = Array.isArray(books);

  return (
    <div className="w-full flex flex-col items-center">
      {Loading ? (
        <div className="w-full flex justify-center items-center h-40">
          <LoaderCircle className="animate-spin text-[#e67e22]" size={40} />
        </div>
      ) : isBooksArray && books.length > 0 ? (
        <Carousel
          className="w-full max-w-4xl mt-5"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {books.map((book) => (
              <CarouselItem
                key={book.uuid}
                className="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5 flex justify-center align-middle min-w-[250px] max-w-[250px]"
              >
                <Card className="border shadow-sm overflow-hidden mx-1 ">
                  <CardContent className="flex flex-col items-center justify-center">
                    <div className="w-full flex justify-center bg-white my-5">
                      <Image
                        src={book.image_url || "/book-placeholder.png"}
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
                        {book.authors.join(", ")}
                      </p>
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
                          isLogin={isLogin}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute">{"<"}</CarouselPrevious>
          <CarouselNext className="">{">"}</CarouselNext>
        </Carousel>
      ) : (
        <div className="w-full flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg font-semibold">Sem livros</p>
        </div>
      )}
    </div>
  );
}
