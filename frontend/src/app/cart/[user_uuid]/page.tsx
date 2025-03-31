"use client";

import * as cartService from "@/services/cartService";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Cart, CartItem } from "@/types/cartTypes";
import CartItemsList from "@/components/CartItemsList";
import SubTotalCart from "@/components/SubTotalCart";

export default function CartPage() {
  const { user_uuid } = useParams() as { user_uuid: string };
  const [cart, setCart] = useState<Cart>({} as Cart);
  const [accCart, setAccCart] = useState<number | null>(null);

  const fetchCart = async () => {
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
        cart.cartItem.reduce((acc, value) => acc - value.quantity, 0) - 1
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
  }, [accCart]);

  return (
    <div>
      {/*Navbar */}
      <div className="flex h-screen bg-[#FFFAF5] justify-evenly">
        <CartItemsList
          user_uuid={user_uuid}
          cart={cart}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleDeleteItem={handleDeleteItem}
        />
        <SubTotalCart cart={cart} />
      </div>
    </div>
  );
}
