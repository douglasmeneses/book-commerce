"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBookByUUID } from "@/services/bookService";
import BookDetails from "@/components/bookDetails";
import { Book } from "@/types/bookTypes";
import { favoriteBook } from "@/services/favoriteService";
import { addItemToCart } from "@/services/cartService";
import CreateUpdateModel from "@/components/CreateUpdateModel";
import { getReviewsByBook, createReview } from "@/services/reviewService";
import CommentsArea from "@/components/ComentsArea";
import { getUserInLocalStorageItem } from "@/utils/localStorageUtils";

export default function BookPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState(() => {
    const storedUser = getUserInLocalStorageItem();
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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

    const fetchReviews = async () => {
      try {
        if (book) {
          const reviews = await getReviewsByBook(book.uuid);
          setReviews(reviews);
        }
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
      }
    };
    fetchBook();
    fetchReviews();
  }, [id]);

  const refreshComments = async () => {
    if (book) {
      const reviews = await getReviewsByBook(book.uuid);
      setReviews(reviews);
      router.refresh();
    }
  };

  useEffect(() => {
    refreshComments();
  }, [book]);

  const handleCreateReview = async ({
    user_uuid,
    book_uuid,
    rating,
    review,
  }: {
    user_uuid: string;
    book_uuid: string;
    rating: number;
    review: string;
  }) => {
    try {
      await createReview(book_uuid, user_uuid, review, rating);
      setIsOpen(false);
      const reviews = await getReviewsByBook(book_uuid);
      setReviews(reviews);
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
    }
  };

  const handleFavoriteBook = async (book_uuid: string) => {
    try {
      await favoriteBook(book_uuid, user?.uuid || "");
    } catch (error) {
      console.error("Error favoriting book:", error);
    }
  };

  const handleAddItem = async (
    user_uuid: string,
    book_uuid: string,
    quantity: number
  ) => {
    try {
      await addItemToCart(user_uuid, book_uuid, quantity);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  if (!book) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <BookDetails
        user_uuid={user?.uuid}
        book={book}
        handleFavoriteBook={handleFavoriteBook}
        isLogin={user ? true : false}
        handleAddItem={addItemToCart}
      />
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#e67e22] hover:bg-[#d35400] text-white px-6 py-2 rounded-md"
      >
        Avaliar Livro
      </button>
      <CreateUpdateModel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleCreateReview}
        user_uuid={user?.uuid}
        book_uuid={book.uuid}
      />

      <CommentsArea
        comments={reviews}
        book_uuid={book.uuid}
        user_uuid={user?.uuid}
        refreshComments={refreshComments}
      />
    </div>
  );
}
