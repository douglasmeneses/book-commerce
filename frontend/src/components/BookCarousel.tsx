import { useState, useEffect } from "react";
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
import { BookCarouselProps } from "@/types/bookTypes";
import { getBooks } from "@/services/bookService";
import { favoriteBook } from "@/services/favoriteService";
import FavoriteButton from "./FavoriteButton";

export default function BookCarousel({
  books,
  genres,
  title,
  handleFavoriteBook,
  isLogin,
}: BookCarouselProps) {
  const [filteredBooks, setFilteredBooks] = useState<Array<Book>>(books);
  const [selectedGenre, setSelectedGenre] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchBooks = async () => {
      if (selectedGenre === "Todos") {
        setFilteredBooks(books);
        return;
      }

      const filter = {
        genre: selectedGenre,
        limit: 20,
        mostLiked: true,
      };

      try {
        const newBooks = await getBooks(filter);
        setFilteredBooks(newBooks);
      } catch (error) {
        console.error("Erro ao buscar livros filtrados:", error);
      }
    };

    fetchBooks();
  }, [selectedGenre, books]);

  return (
    <div className="w-full">
      {genres && (
        <ul className="flex mt-2 gap-10">
          <h1 className="font-bold text-2xl w-2/6 ml-10 leading-none">
            {title}
          </h1>
          {[...new Set(genres)].map((genre) => (
            <li
              key={genre}
              className="text-sm font-light hover:text-[#e67e22] cursor-pointer"
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </li>
          ))}
        </ul>
      )}
      {!genres && (
        <h1 className="font-bold text-2xl leading-none mt-10 w-full text-center">
          {title}
        </h1>
      )}
      <div className="mt-10 flex justify-center">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {filteredBooks.map((book) => (
              <CarouselItem
                key={book.id}
                className="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5 flex justify-center align-middle"
              >
                <div className="">
                  <Card className="border shadow-sm overflow-hidden mx-10">
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
                          {book.authors.map((author, index) => (
                            <span key={index}>
                              {author.author.name}{" "}
                              {index < book.authors.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </p>
                        <div className="flex gap-2 items-center mt-2">
                          <Button className="text-xs h-8 bg-[#e67e22] hover:bg-[#d35400] text-white font-semibold rounded-sm">
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
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 bg-white border shadow-md" />
          <CarouselNext className="right-0 bg-white border shadow-md" />
        </Carousel>
      </div>
    </div>
  );
}
