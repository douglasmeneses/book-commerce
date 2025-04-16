"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/userTypes";

import { Book, FavoriteBookResponse } from "@/types/bookTypes";
import { getBooks, getFavoriteBooks } from "@/services/bookService";
import { getOrdersByUser } from "@/services/orderService";
import BooksPerfilCarousel from "@/components/BooksCarouselProfile";

import ProfileHeaderInfos from "@/components/ProfileHeaderInfos";
import ProfileBooksSection from "@/components/ProfileBooksSection";
import { favoriteBook } from "@/services/favoriteService";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [favoritedBooks, setFavoritedBooks] = useState<Array<Book>>([]);
  const [latestOrders, setLatestOrders] = useState<Array<Book>>([]);

  const [accFetchsBooks, setAccFetchsBooks] = useState<number>(0);

  const handleFavoriteBook = async (book_uuid: string) => {
    try {
      await favoriteBook(book_uuid, user?.uuid || "");
      setAccFetchsBooks((prev) => prev + 1);
    } catch (error) {
      console.error("Error favoriting book:", error);
    }
  };


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const Favorites = (await getFavoriteBooks(
          user?.uuid || ""
        )) as Array<FavoriteBookResponse>;
        setFavoritedBooks(
          Favorites.map((favoriteResponse) => favoriteResponse.book) || []
        );

        const orders = await getOrdersByUser(user?.uuid || "");
        setLatestOrders(orders);

      } catch (error) {
        toast.error("Erro ao buscar livros favoritos.");
      }
    };

    fetchBooks();
  }, [accFetchsBooks]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#FFFAF5]">
      <ProfileHeaderInfos user={user} />
      <ProfileBooksSection
        favoritedBooks={favoritedBooks}
        LatestOrders={latestOrders}
        handleFavoriteBook={handleFavoriteBook}
        isLogin={user ? true : false}

      />
      <div
        className="border border-[#E2E2E2] w-full absolute z-[1]"
        style={{ top: 155, left: 0 }}
      />
    </div>
  );
}