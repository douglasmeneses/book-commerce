export interface Order {
    id: number;
    user_uuid: string;
    status: string;
    total: number;
    created_at: string;
    updated_at: string;
    items: {
      book_uuid: string;
      quantity: number;
      price: number;
    }[];
  }
  