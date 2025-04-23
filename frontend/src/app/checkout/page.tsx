"use client";

import { useEffect, useState } from "react";
import AddressForm from "@/components/AddressForm";
import PaymentMethods from "@/components/PaymentMethods";
import SavedCards from "@/components/SavedCards";
import OrderReview from "@/components/OrderReview";
import ConfirmOrder from "@/components/ConfirmOrder";
import { Cart } from "@/types/cartTypes";
import * as cartService from "@/services/cartService";
import * as orderService from "@/services/orderService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const user = localStorage.getItem("user");
  const user_uuid = user ? JSON.parse(user).uuid : "";
  const [cart, setCart] = useState<Cart>({} as Cart);
  const [paymentMethod, setPaymentMethod] = useState<string>("PIX");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    const response = await cartService.getCart(user_uuid);
    if (typeof response === "string") {
      toast.error("Erro ao buscar carrinho. Faça login novamente.");
      router.push("/login");
      return;
    }
    setCart(response);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!cart || cart.cartItem.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }

    const total = cart.cartItem.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const items = cart.cartItem.map((item) => ({
      book_uuid: item.book_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = {
        status: "PENDING",
        total: cart.cartItem.reduce((acc, item) => acc + item.price * item.quantity, 0),
        items: cart.cartItem.map((item) => ({
          book_uuid: item.book.uuid, 
          quantity: item.quantity,
          price: item.price,
        })),
      };
      

    try {
      await orderService.createOrder(user_uuid, order);
      toast.success("Pedido realizado com sucesso!");
      router.push("/pedidos");
    } catch (err) {
      toast.error("Erro ao finalizar pedido.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="p-8 bg-[#FFFAF5] min-h-screen flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-4">
          <AddressForm/>
          <PaymentMethods selected={paymentMethod} onChange={setPaymentMethod} />
          {paymentMethod === "CARTÃO DE CRÉDITO" && (
            <SavedCards
              cards={[
                {
                  id: 1,
                  number: "**** **** **** 1289",
                  balance: 5750.2,
                  expiry: "09/25",
                  color: "red",
                },
                {
                  id: 2,
                  number: "**** **** **** 1290",
                  balance: 5750.2,
                  expiry: "09/25",
                  color: "blue",
                },
              ]}
              selected={selectedCard}
              onSelect={setSelectedCard}
            />
          )}
          <OrderReview
  items={
    cart?.cartItem
      ?.filter((item) => item.book)
      .map((item) => ({
        title: item.book.title,
        author: item.book.authors.map(a => a.name).join(", "),
        quantity: item.quantity,
        price: item.price,
        image: item.book.image_url || item.book.image || "/default-book.png",


      })) || []
  }
/>

        </div>
        <div>
          <ConfirmOrder
            total={
                cart?.cartItem
                  ? cart.cartItem.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    )
                  : 0
              }
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
}
