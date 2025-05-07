"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TextField from "@mui/material/TextField";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";

interface CreateUpdateModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    user_uuid: string;
    book_uuid: string;
    rating: number;
    review: string;
  }) => void;
  user_uuid: string;
  book_uuid: string;
  initialData?: { rating: number; review: string };
}

export default function CreateUpdateModel({
  isOpen,
  onClose,
  onSubmit,
  user_uuid,
  book_uuid,
  initialData,
}: CreateUpdateModelProps) {
  const [rating, setRating] = useState(initialData?.rating || 0.0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [review, setReview] = useState(initialData?.review || "");

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const isHalf = x < width / 2;
    setHoverRating(index + (isHalf ? 0.5 : 1));
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const handleSubmit = () => {
    if (rating && review) {
      onSubmit({ user_uuid, book_uuid, rating, review });
      onClose();
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  const displayRating = hoverRating ?? rating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Avaliação" : "Criar Avaliação"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-start mt-4">
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            const isFullStar = displayRating >= starValue;
            const isHalfStar = !isFullStar && displayRating >= starValue - 0.5;

            return (
              <button
                key={index}
                onClick={() => handleRating(hoverRating ?? starValue)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                {isFullStar ? (
                  <StarIcon className="text-yellow-400 w-8 h-8" />
                ) : isHalfStar ? (
                  <StarHalfIcon className="text-yellow-400 w-8 h-8" />
                ) : (
                  <StarBorderIcon className="text-gray-400 w-8 h-8" />
                )}
              </button>
            );
          })}
          <button
            onClick={() => {
              setRating(0);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded ml-4"
          >
            Limpar
          </button>
        </div>

        <div className="mb-4">
          <TextField
            id="review"
            label="Escrever uma avaliação"
            placeholder="O que os outros clientes precisam saber?"
            multiline
            rows={4}
            fullWidth
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            {initialData ? "Atualizar" : "Enviar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
