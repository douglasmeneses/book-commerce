"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getBookByUUID } from "@/services/bookService";
import BookDetails from "@/components/bookDetails";
import { Book } from "@/types/bookTypes";
import { favoriteBook } from "@/services/favoriteService";

export default function BookPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (typeof id === "string") {
          const bookData = await getBookByUUID(id);
          setBook(bookData);
        }
      } catch (error) {
        console.error("Erro ao buscar livro:", error);
      }
    };
    fetchBook();
  }, [id]);

  const handleFavoriteBook = async (book_uuid: string) => {
    try {
      await favoriteBook(book_uuid, user?.uuid || "");
    } catch (error) {
      console.error("Error favoriting book:", error);
    }
  };

  if (!book) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <BookDetails
        book={book}
        handleFavoriteBook={handleFavoriteBook}
        isLogin={user ? true : false}
      />
    </div>
  );
}
