"use client";

import * as cartService from "@/services/cartService";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Cart, CartItem } from "@/types/cartTypes";
import CartItemsList from "@/components/CartItemsList";
import SubTotalCart from "@/components/SubTotalCart";
import { set } from "react-hook-form";

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
      console.log("Cart data:", response);
      toast.success("Cart fetched successfully!");
    } catch (error) {
      console.error("Error parsing cart data:", error);
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
    console.log("Response from addItemToCart:", response);
    try {
      if (typeof response === "string") {
        toast.error(response);
      }

      toast.success("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error(
        `Error adding item to cart: ${
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
        />
        <SubTotalCart cart={cart} />
      </div>
    </div>
  );
}
