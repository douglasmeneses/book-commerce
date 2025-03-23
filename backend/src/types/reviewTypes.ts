import { Decimal } from "@prisma/client/runtime/library";

export interface Review {
  book_id: number;
  user_id: number;
  content: string;
  rating: Decimal | number;
}

export interface CreateReview {
  message: string;
  data: Review;
}

export interface ReviewWithUser {
  id: number;
  uuid: string;
  user_id: number;
  book_id: number;
  content: string;
  rating: Decimal | number;
  created_at: Date;
  updated_at: Date;
  user: {
    uuid: string;
    name: string;
    username: string;
    avatar: Uint8Array | null;
  };
}
