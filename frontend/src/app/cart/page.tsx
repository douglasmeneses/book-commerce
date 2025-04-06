"use client";

import * as cartService from "@/services/cartService";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { Cart, CartItem } from "@/types/cartTypes";
import CartItemsList from "@/components/CartItemsList";
import SubTotalCart from "@/components/SubTotalCart";

export default function CartPage() {
  const user = localStorage.getItem("user");
  const user_uuid = user ? JSON.parse(user).uuid : "";
  const [cart, setCart] = useState<Cart>({} as Cart);
  const [accFetchCarts, setAccFetchCarts] = useState<number>(0);
  const [accCart, setAccCart] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCart = async () => {
    if (accFetchCarts == 0) setLoading(true);
    const response = await cartService.getCart(user_uuid);
    console.log("Response from cart service:", response);
    try {
      if (typeof response === "string") {
        throw new Error(response);
      }
      setCart(response);
    } catch (error) {
      toast.error(
        `Error parsing cart data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
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
        `Error adding item to cart: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleRemoveItem = async (
    cart_id: number,
    user_uuid: string,
    cartItem_id: number,
    quantity: number
  ): Promise<void> => {
    const response = await cartService.removeItemFromCart(
      cart_id,
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
        `Error removing item from cart: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleDeleteItem = async (
    cartItem_id: number,
    user_uuid: string,
    cart_id: number
  ) => {
    const response = await cartService.deleteCartItem(
      cartItem_id,
      user_uuid,
      cart_id
    );
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
        `Error deleting item from cart: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  useEffect(() => {
    fetchCart();
    setAccFetchCarts((prep) => (prep ? prep + 1 : 1));
  }, [accCart]);

  return (
    <div>
      <div className="flex h-screen bg-[#FFFAF5] justify-evenly">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-gray-500">Carregando carrinho...</p>
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
