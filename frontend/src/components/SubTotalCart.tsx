import React from "react";
import { Cart } from "@/types/cartTypes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SubTotalCart({ cart }: { cart: Cart }) {
  return (
    <div className="Subtotal flex font-bold w-1/5 mt-9">
      <Card className="bg-white rounded-md shadow-md p-4 text-base w-full h-1/5 flex flex-col justify-center items-center">
        <h2>
          Subtotal
          {` (${cart?.cartItem?.reduce(
            (acc, item) => acc + item.quantity,
            0
          )} Produtos )`}
          :{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(cart?.totalPrice || 0)}
        </h2>
        <Button
          variant="secondary"
          className="mt-4 bg-orange-600 text-white rounded-md p-2 w-full text-base hover:bg-black"
          onClick={() => {
            toast.success("Compra realizada com sucesso!");
          }}
        >
          Concluir Compra
        </Button>
      </Card>
    </div>
  );
}
