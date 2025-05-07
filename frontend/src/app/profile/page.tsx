"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/userTypes";
import { Book, FavoriteBookResponse } from "@/types/bookTypes";
import { getFavoriteBooks } from "@/services/bookService";
import { getOrdersByUser } from "@/services/orderService";
import { getRecommendations } from "@/services/userServices";
import ProfileHeaderInfos from "@/components/ProfileHeaderInfos";
import ProfileBooksSection from "@/components/ProfileBooksSection";
import { favoriteBook } from "@/services/favoriteService";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [favoritedBooks, setFavoritedBooks] = useState<Array<Book>>([]);
  const [latestOrders, setLatestOrders] = useState<Array<Book>>([]);
  const [recomendationsBooks, setRecomendationsBooks] = useState<Array<Book>>(
    []
  );
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
        const Favorites = await getFavoriteBooks(user?.uuid || "");
        setFavoritedBooks(Favorites);

        if (user) {
          const recomendations = await getRecommendations(user?.uuid);
          setRecomendationsBooks(recomendations);
        }

        const orders = await getOrdersByUser(user?.uuid || "");
        setLatestOrders(orders);
      } catch (error) {
        toast.error("Erro ao buscar livros favoritos.");
        console.error("Error fetching favorite books:", error);
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
        recomendations={recomendationsBooks}
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
