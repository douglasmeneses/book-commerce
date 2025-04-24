import { Label } from "@radix-ui/react-label";
import BooksPerfilCarousel from "./BooksCarouselProfile";
import { Book } from "@/types/bookTypes";

interface ProfileBooksSectionProps {
  favoritedBooks: Array<Book>;
  LatestOrders: Array<Book>;
  recomendations: Array<Book>;
  handleFavoriteBook: (book_uuid: string) => void;
  isLogin: boolean;
}

export default function ProfileBooksSection({
  favoritedBooks,
  LatestOrders,
  recomendations,
  handleFavoriteBook,
  isLogin,
}: ProfileBooksSectionProps) {
  return (
    <div className="mb-8">
      <Label className="text-2xl font-bold text-[#241400] mb-4">
        Favoritos
      </Label>
      <BooksPerfilCarousel
        books={favoritedBooks}
        handleFavoriteBook={handleFavoriteBook}
        isLogin={isLogin}
      />
      <br></br>
      <Label className="text-2xl font-bold text-[#241400] mb-4">
        Ultimos pedidos
      </Label>
      <BooksPerfilCarousel
        books={LatestOrders}
        handleFavoriteBook={handleFavoriteBook}
        isLogin={isLogin}
      />
      <br></br>
      {recomendations.length > 1 && (
        <>
          <Label className="text-2xl font-bold text-[#241400] mb-4">
            Recomendados para você
          </Label>
          <BooksPerfilCarousel
            books={recomendations}
            handleFavoriteBook={handleFavoriteBook}
            isLogin={isLogin}
          />
        </>
      )}
    </div>
  );
}
