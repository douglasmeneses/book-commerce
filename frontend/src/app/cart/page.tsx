"use client";

import * as cartService from "@/services/cartService";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Cart } from "@/types/cartTypes";
import CartItemsList from "@/components/CartItemsList";
import SubTotalCart from "@/components/SubTotalCart";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { getUserInLocalStorageItem } from "@/utils/localStorageUtils";
import { User } from "@/types/userTypes";

export default function CartPage() {
  const router = useRouter();
  const [user_uuid, setUserUuid] = useState<string>("");
  const [cart, setCart] = useState<Cart>({} as Cart);
  const [accFetchCarts, setAccFetchCarts] = useState<number>(0);
  const [accCart, setAccCart] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = getUserInLocalStorageItem();
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUserUuid(parsedUser?.uuid || "");
  }, []);

  const fetchCart = async () => {
    if (!user_uuid) return;
    if (accFetchCarts == 0) setLoading(true);
    const response = await cartService.getCart(user_uuid);
    try {
      if (typeof response === "string") {
        throw new Error(response);
      }
      setCart(response);
    } catch (error) {
      if (error instanceof Error && error.message.includes("401")) {
        toast.info("Sessão expirada, redirecionando para o login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } finally {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 900);

      return () => clearTimeout(timer);
    }
  };

  const handleAddItem = async (
    user_uuid: string,
    book_uuid: string,
    quantity: number
  ) => {
    const response = await cartService.addItemToCart(
      user_uuid,
      book_uuid,
      quantity
    );

    setAccCart(
      (prep) =>
        cart.cartItem.reduce((acc, value) => acc + value.quantity, 0) + 1
    );
    try {
      if (typeof response === "string") {
        toast.error(response);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error(
        `Erro ao adicionar item ao carrinho: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleRemoveItem = async (
    user_uuid: string,
    cartItem_id: number,
    quantity: number
  ): Promise<void> => {
    const response = await cartService.removeItemFromCart(
      user_uuid,
      cartItem_id,
      quantity
    );
    setAccCart(
      (prep) =>
        cart.cartItem.reduce((acc, value) => acc + value.quantity, 0) - 1
    );
    try {
      if (typeof response === "string") {
        toast.error(response);
      }
    } catch (error) {
      toast.error(
        `Erro ao remover item do carrinho: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleDeleteItem = async (cartItem_id: number, user_uuid: string) => {
    const response = await cartService.deleteCartItem(cartItem_id, user_uuid);
    setAccCart(
      (prep) =>
        cart.cartItem.reduce((acc, value) => acc + value.quantity, 0) - 1
    );
    try {
      if (typeof response === "string") {
        toast.error(response);
      }
      toast.success("Item deletado com sucesso!");
    } catch (error) {
      toast.error(
        `Erro ao deletar item do carrinho: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  useEffect(() => {
    if (user_uuid) {
      fetchCart();
      setAccFetchCarts((prep) => (prep ? prep + 1 : 1));
    }
  }, [accCart, user_uuid]);

  return (
    <div>
      <div className="flex h-screen bg-[#FFFAF5] justify-evenly">
        {loading ? (
          <div className="w-full flex justify-center items-center h-full">
            <LoaderCircle className="animate-spin text-[#e67e22]" size={40} />
          </div>
        ) : !cart.cartItem || cart.cartItem.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-2xl font-bold text-gray-700">
              Seu carrinho está vazio
            </h1>
            <p className="text-gray-500">Adicione itens ao seu carrinho!</p>
          </div>
        ) : (
          <>
            <CartItemsList
              user_uuid={user_uuid}
              cart={cart}
              handleAddItem={handleAddItem}
              handleRemoveItem={handleRemoveItem}
              handleDeleteItem={handleDeleteItem}
            />
            <SubTotalCart cart={cart} />
          </>
        )}
      </div>
    </div>
  );
}
