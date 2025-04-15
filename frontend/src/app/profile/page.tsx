"use client";

import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { User } from "@/types/userTypes";
import { Book } from "@/types/bookTypes";
import { getBooks, getFavoriteBooks } from "@/services/bookService";
import BooksPerfilCarousel from "@/components/BooksCarouselProfile";
import ProfileHeaderInfos from "@/components/ProfileHeaderInfos";
import ProfileBooksSection from "@/components/ProfileBooksSection";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [favoritedBooks, setFavoritedBooks] = useState<Array<Book>>([]);
  const [books, setBooks] = useState<Array<Book>>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const Favorites = await getFavoriteBooks(user?.uuid || "");
        setFavoritedBooks(Favorites);
        const books = await getBooks({ search: "a" });
        setBooks(books);
      } catch (error) {
        toast.error("Erro ao buscar livros favoritos.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#FFFAF5]">
      <ProfileHeaderInfos user={user} />
      <ProfileBooksSection
        favoritedBooks={favoritedBooks}
        LatestOrders={books} // tem que passar os livros mais recentes aqui, mas não tem no backend ainda
      />
      <div
        className="border border-[#E2E2E2] w-full absolute z-[1]"
        style={{ top: 155, left: 0 }}
      />
    </div>
  );
}
