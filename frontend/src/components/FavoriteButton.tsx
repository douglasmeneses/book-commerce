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
}

export default function FavoriteButton({
  book_uuid,
  favorite,
  handleFavoriteBook,
  isLogin,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(favorite && favorite.length > 0);
  return (
    <>
      {favorited ? (
        <FavoriteIcon
          className="text-[#e67e22] hover:text-[#d35400] cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleFavoriteBook(book_uuid);
            setFavorited(!favorited);
          }}
        />
      ) : (
        <FavoriteBorderIcon
          className="text-[#e67e22] hover:text-[#d35400] cursor-pointer"
          onClick={(e) => {
            if (!isLogin) {
              toast.error("Você precisa estar logado para favoritar um livro.");
              return;
            }
            e.preventDefault();
            handleFavoriteBook(book_uuid);
            setFavorited(!favorited);
          }}
        />
      )}
    </>
  );
}
