import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { CartItem } from "@/types/cartTypes";

interface QuantitySelectorButtonsProps {
  user_uuid: string;
  item: CartItem;
  handleAddItem: (
    user_uuid: string,
    book_uuid: string,
    quantity: number
  ) => Promise<void>;
}

export default function QuantitySelectorButtons({
  user_uuid,
  item,
  handleAddItem,
}: QuantitySelectorButtonsProps) {
  return (
    <div className="flex justify-between bg-[#FAFFFD] rounded-[17px] items-center w-[15%]">
      <Button
        size={"icon"}
        variant="secondary"
        className="bg-[#E16A00] text-white rounded-full min-w-[2rem]"
      >
        {item.quantity > 1 ? <Minus /> : <Trash />}
      </Button>

      <p>
        <strong>{item.quantity}</strong>
      </p>
      <Button
        size={"icon"}
        variant="secondary"
        className="bg-[#E16A00] text-white rounded-full min-w-[2rem]"
        onClick={(e) => {
          e.preventDefault();
          handleAddItem(user_uuid, item.book.uuid, 1);
        }}
      >
        <Plus />
      </Button>
    </div>
  );
}
