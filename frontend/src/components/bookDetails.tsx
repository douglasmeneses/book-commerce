"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { Book } from "@/types/bookTypes";
import { ScanBarcode } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { Cart } from "@/types/cartTypes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BookDetailsProps {
  user_uuid: string;
  book: Book;
  handleFavoriteBook: (book_uuid: string) => Promise<void>;
  isLogin: boolean;
  handleAddItem: (
    user_uuid: string,
    book_uuid: string,
    quantity: number
  ) => Promise<string | Cart>;
}

export default function BookDetails({
  user_uuid,
  book,
  handleFavoriteBook,
  isLogin,
  handleAddItem,
}: BookDetailsProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col lg:flex-row gap-20 p-8 bg-white">
      <div className="flex-shrink-0">
        <Image
          src={book.image_url || "/book-placeholder.png"}
          alt={book.title}
          width={326}
          height={491}
          className="rounded shadow-md shadow-gray-500"
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            {book.publishers[0]?.publisher.name || "Desconhecido"}
          </p>
          <p className="text-lg font-semibold">
            {book.authors[0] || "Autor Desconhecido"}
          </p>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <div className="flex flex-row items-center gap-4">
          <h1 className="text-[60px] font-bold text-[#241400]">{book.title}</h1>
          <p className="text-[40px] text-gray-500 mt-3">
            {new Date(book.release_date).getFullYear()}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <p className="text-sm text-gray-500">{book.page_count} Páginas</p>
          <p className="text-sm text-gray-500">{book.language}</p>
          <p className="text-sm text-gray-500">
            {book.genres.map((genre) => genre.genre.name).join(", ")}
          </p>
        </div>

        <p className="text-3xl font-bold text-[#24140099] mt-4">
          R$ {book.price}
        </p>

        <div className="flex gap-4 mt-4 items-center">
          <Button
            onClick={(e) => {
              e.preventDefault();
              user_uuid
                ? (() => {
                    handleAddItem(user_uuid, book.uuid, 1);
                    toast.success("Item adicionado ao carrinho!");
                  })()
                : () => {
                    toast.info(
                      "Você precisa estar logado para adicionar itens ao carrinho."
                    );
                    setTimeout(() => {
                      router.push("/login");
                    }, 1000);
                  };
            }}
            className="bg-[#e67e22] hover:bg-[#d35400] text-white px-6 py-2 rounded-md"
          >
            <strong>Adicionar ao Carrinho</strong>
          </Button>

          {isLogin && (
            <FavoriteButton
              book_uuid={book.uuid}
              favorite={book.favorites}
              handleFavoriteBook={handleFavoriteBook}
              isLogin={isLogin}
            />
          )}
        </div>

        <div className="flex items-center gap-1 mt-4">
          {Array.from({ length: 5 }, (_, index) => {
            const rating = parseFloat(book.rating);
            const isFullStar = index < Math.floor(rating);
            const isHalfStar = index === Math.floor(rating) && rating % 1 !== 0;

            return isFullStar ? (
              <StarIcon key={index} className="text-yellow-400" />
            ) : isHalfStar ? (
              <StarHalfIcon key={index} className="text-yellow-400" />
            ) : (
              <StarBorderIcon key={index} className="text-yellow-400" />
            );
          })}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-[#241400]">Sinopse</h2>
          <p className="text-gray-600 mt-2">{book.synopsis}</p>
        </div>

        <div className="mt-6 flex items-start">
          <div className="mt-6 flex flex-col items-center">
            <h2 className="text-xl font-bold text-[#241400]">ISBN</h2>
            <ScanBarcode />
            <p className="text-gray-600 mt-2">{book.ISBN}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
