import { Label } from "@radix-ui/react-label";
import BooksPerfilCarousel from "./BooksCarouselProfile";
import { Book } from "@/types/bookTypes";

export default function ProfileBooksSection({
  favoritedBooks,
  LatestOrders,
}: {
  favoritedBooks: Array<Book>;
  LatestOrders: Array<Book>;
}) {
  return (
    <div className="mb-8">
      <Label className="text-2xl font-bold text-[#241400] mb-4">
        Favoritos
      </Label>
      <BooksPerfilCarousel
        books={favoritedBooks}
        title="" // esse campo não é utilizado no componente, mas é necessário para o tipo BookCarouselProps
      />
      <br></br>
      <Label className="text-2xl font-bold text-[#241400] mb-4">
        Ultimos pedidos
      </Label>
      <BooksPerfilCarousel
        books={LatestOrders}
        title="" // esse campo não é utilizado no componente, mas é necessário para o tipo BookCarouselProps
      />
    </div>
  );
}
