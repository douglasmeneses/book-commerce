import { Button } from "@/components/ui/button";
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
import { CartItem } from "@/types/cartTypes";
import { Trash } from "lucide-react";

interface DeleteModelProps {
  user_uuid: string;
  item: CartItem;
  deleteBookFunc: (
    cartItem_id: number,
    user_uuid: string,
    cart_id: number
  ) => void;
}

export default function DeleteModel({
  user_uuid,
  item,
  deleteBookFunc,
}: DeleteModelProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          variant="secondary"
          className="bg-[#E16A00] text-white rounded-full min-w-[2rem] hover:bg-black"
        >
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remover livro</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja remover o livro{" "}
            <strong>{item.book.title}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex  mt-4">
          <Button
            variant="secondary"
            className="bg-[#E16A00] text-white rounded-full min-w-[2rem] hover:bg-black"
            onClick={(e) => {
              e.preventDefault();
              deleteBookFunc(item.id, user_uuid, item.cart_id);
            }}
          >
            Sim
          </Button>
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="bg-[#E16A00] text-white rounded-full min-w-[2rem] hover:bg-black"
            >
              Não
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
