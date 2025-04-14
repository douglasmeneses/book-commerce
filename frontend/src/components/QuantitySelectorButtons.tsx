"use client";

import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { CartItem } from "@/types/cartTypes";
import { useEffect, useState } from "react";
import DeleteModel from "./DeleteModel";

interface QuantitySelectorButtonsProps {
  user_uuid: string;
  item: CartItem;
  handleAddItem: (
    user_uuid: string,
    book_uuid: string,
    quantity: number
  ) => Promise<void>;
  handleRemoveItem: (
    user_uuid: string,
    cartItem_id: number,
    quantity: number
  ) => Promise<void>;

  handleDeleteItem: (cartItem_id: number, user_uuid: string) => Promise<void>;
}

export default function QuantitySelectorButtons({
  user_uuid,
  item,
  handleAddItem,
  handleRemoveItem,
  handleDeleteItem,
}: QuantitySelectorButtonsProps) {
  const [quantity, setQuantity] = useState<number>(item.quantity);

  useEffect(() => {}, [quantity]);

  return (
    <div className="flex justify-between bg-[#FAFFFD] rounded-[17px] items-center w-[15%]">
      {quantity <= 1 ? (
        <DeleteModel
          item={item}
          deleteBookFunc={handleDeleteItem}
          user_uuid={user_uuid}
        />
      ) : (
        <Button
          size={"icon"}
          variant="secondary"
          className="bg-[#E16A00] text-white rounded-full min-w-[2rem] hover:bg-black"
          onClick={(e) => {
            e.preventDefault();
            setQuantity((prep) => prep - 1),
              handleRemoveItem(user_uuid, item.id, 1);
          }}
        >
          <Minus />
        </Button>
      )}

      <p>
        <strong>{item.quantity}</strong>
      </p>
      <Button
        size={"icon"}
        variant="secondary"
        className="bg-[#E16A00] text-white rounded-full min-w-[2rem] hover:bg-black"
        onClick={(e) => {
          e.preventDefault();
          setQuantity((prep) => prep + 1);
          handleAddItem(user_uuid, item.book.uuid, 1);
        }}
      >
        <Plus />
      </Button>
    </div>
  );
}
