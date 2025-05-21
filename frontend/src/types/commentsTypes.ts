export interface Comment {
  uuid: string;
  user: { uuid: string; name: string };
  rating: number;
  content: string;
  created_at: string;
}

export interface CommentsAreaProps {
  comments: Comment[];
  book_uuid: string;
  user_uuid: string;
  refreshComments: () => void;
}
