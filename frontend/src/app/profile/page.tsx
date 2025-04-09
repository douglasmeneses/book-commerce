"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/userTypes";
import { Book } from "@/types/bookTypes";
import { getBooks } from "@/services/bookService";
import UserProfileCard from "@/components/UserProfileCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BooksPerfilExemple from "@/components/BooksPerfilExemple";
import { Label } from "@radix-ui/react-label";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Array<Book>>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const mostLiked = await getBooks({ mostLiked: true });
        setBooks(mostLiked);
      } catch (error) {
        console.log("Erro ao buscar livros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-100 bg-[#FFFAF5]">
      <div className="flex flex-row justify-center items-center gap-4 mt-8 mb-4">
        <Button
          type="submit"
          className="w-auto min-w-[170px] bg-[#e67e22] text-white"
        >
          PEDIDOS
        </Button>
        <UserProfileCard user={user} />
        <div className="flex flex-col items-center">
          <Button
            type="submit"
            className="w-auto min-w-[180px] bg-[#e67e22] text-white mb-8"
          >
            ATUALIZAR DADOS
          </Button>
          <Button
            type="submit"
            className="w-auto min-w-[180px] bg-[#e67e22] text-white"
          >
            EDITAR ENDEREÇOS
          </Button>
        </div>
      </div>
      <div className="mb-8">
        <Label className="text-2xl font-bold text-[#241400] mb-4">
          Favoritos
        </Label>
        <BooksPerfilExemple books={books} title="Most Liked Books" />
        <br></br>
        <Label className="text-2xl font-bold text-[#241400] mb-4">
          Ultimos pedidos
        </Label>
        <BooksPerfilExemple books={books} title="Most Liked Books" />
      </div>
    </div>
  );
}
