"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CreateUpdateModel from "./CreateUpdateModel";
import { deleteReview, updateReview } from "@/services/reviewService";
import { Comment, CommentsAreaProps } from "@/types/commentsTypes";

export default function CommentsArea({
  comments,
  book_uuid,
  user_uuid,
  refreshComments,
}: CommentsAreaProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const handleDelete = async (review_uuid: string) => {
    try {
      await deleteReview(review_uuid);
      refreshComments();
    } catch (error) {
      console.error("Erro ao deletar avaliação:", error);
    }
  };

  const handleEdit = (comment: Comment) => {
    setSelectedComment(comment);
    setIsEditOpen(true);
  };

  const handleUpdate = async ({
    review,
    rating,
  }: {
    review: string;
    rating: number;
  }) => {
    if (selectedComment) {
      try {
        await updateReview(selectedComment.uuid, review, rating);
        setIsEditOpen(false);
        refreshComments();
      } catch (error) {
        console.error("Erro ao atualizar avaliação:", error);
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comentários</h2>
      {comments.length === 0 && (
        <p className="text-gray-500">Nenhum comentário encontrado.</p>
      )}
      {comments.map((comment) => (
        <div
          key={comment.uuid}
          className="border-b border-gray-300 pb-4 mb-4 flex flex-col"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{comment.user.name}</p>
              <p className="text-sm text-gray-500">
                Avaliado em {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const isFullStar = comment.rating >= starValue;
                const isHalfStar =
                  !isFullStar && comment.rating >= starValue - 0.5;

                return isFullStar ? (
                  <StarIcon key={index} className="text-yellow-400" />
                ) : isHalfStar ? (
                  <StarHalfIcon key={index} className="text-yellow-400" />
                ) : (
                  <StarBorderIcon key={index} className="text-gray-400" />
                );
              })}
            </div>
          </div>
          <p className="mt-2">{comment.content}</p>
          {comment.user.uuid === user_uuid && (
            <div className="flex gap-2 mt-2">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleEdit(comment)}
              >
                Editar
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(comment.uuid)}
              >
                Deletar
              </Button>
            </div>
          )}
        </div>
      ))}

      {selectedComment && (
        <CreateUpdateModel
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSubmit={({ review, rating }) => handleUpdate({ review, rating })}
          user_uuid={user_uuid}
          book_uuid={book_uuid}
          initialData={{
            rating: selectedComment.rating,
            review: selectedComment.content,
          }}
        />
      )}
    </div>
  );
}
