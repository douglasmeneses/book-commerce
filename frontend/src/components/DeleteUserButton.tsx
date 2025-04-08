import React from "react";
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
import { Trash } from "lucide-react";
import { deleteUser } from "@/services/userServices";
import { useToast } from "@/hooks/use-toast";

interface DeleteUserButtonProps {
  user_uuid: string;
}

const DeleteUserButton = ({ user_uuid }: DeleteUserButtonProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteUser(user_uuid);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o usuário.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-80 bg-[#e67e22] text-white mt-10 mb-8"
        >
          Deletar Usuário
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remover Usuário</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja remover o Usuário?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex  mt-4">
          <Button
            variant="secondary"
            className="bg-[#E16A00] text-white rounded-full min-w-[2rem] hover:bg-black"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
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
};

export default DeleteUserButton;
