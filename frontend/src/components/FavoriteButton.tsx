import { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toast } from "sonner";
import { Book, Favorite } from "@/types/bookTypes";

interface FavoriteButtonProps {
  book_uuid: string;
  favorite?: Favorite[];
  handleFavoriteBook: (book_uuid: string) => void;
  isLogin: boolean;
  clasasName?: string;
}

export default function FavoriteButton({
  book_uuid,
  favorite,
  handleFavoriteBook,
  isLogin,
  clasasName,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(favorite && favorite.length > 0);
  return (
    <>
      {favorited ? (
        <FavoriteIcon
          className={`text-[#e67e22] hover:text-[#d35400] cursor-pointer ${clasasName}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavoriteBook(book_uuid);
            setFavorited(!favorited);
          }}
        />
      ) : (
        <FavoriteBorderIcon
          className={`text-[#e67e22] hover:text-[#d35400] cursor-pointer ${clasasName}`}
          onClick={(e) => {
            if (!isLogin) {
              toast.error("Você precisa estar logado para favoritar um livro.");
              return;
            }
            e.stopPropagation();
            e.preventDefault();
            handleFavoriteBook(book_uuid);
            setFavorited(!favorited);
          }}
        />
      )}
    </>
  );
}
