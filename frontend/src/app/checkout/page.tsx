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
import { getUserInLocalStorageItem } from "@/utils/localStorageUtils";

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // Inicializa como null
  const [cart, setCart] = useState<Cart>({} as Cart);
  const [paymentMethod, setPaymentMethod] = useState<string>("PIX");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null); // New state for selected address
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // New state for order placement loading
  const [userCards, setUserCards] = useState<any[]>([]); // Placeholder for user cards

  useEffect(() => {
    const storedUser = getUserInLocalStorageItem();
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const user_uuid: string = user ? user.uuid : "";

  const fetchCart = async () => {
    setLoading(true);
    const response = await cartService.getCart(user_uuid);
    if (typeof response === "string") {
      toast.error("Erro ao buscar carrinho. Faça login novamente.");
      router.push("/login");
      setLoading(false); // Ensure loading is set to false on error
      return;
    }
    setCart(response);
    setLoading(false);
  };

  // Placeholder: You'll need to implement fetching user cards
  useEffect(() => {
    if (user_uuid) {
      // Example: fetchUserCards(user_uuid).then(setUserCards);
    }
  }, [user_uuid]);

  const handleConfirm = async () => {
    if (!selectedAddressId) {
      toast.error("Por favor, selecione ou adicione um endereço de entrega.");
      return;
    }
    if (paymentMethod === "CARTÃO DE CRÉDITO" && !selectedCard) {
      toast.error("Por favor, selecione um cartão de crédito.");
      return;
    }
    if (!cart || cart.cartItem.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }

    setIsPlacingOrder(true); // Start loading for placing order

    // Obtendo o endereço selecionado
    const address_id = selectedAddressId; // Use selectedAddressId

    const order = {
      status: "PENDING",
      total: cart.cartItem.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      payment_method: paymentMethod,
      address_id: address_id,
      credit_card_user_id:
        paymentMethod === "CARTÃO DE CRÉDITO" ? selectedCard : undefined,
      items: cart.cartItem.map((item) => ({
        book_uuid: item.book.uuid,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      await orderService.createOrder(user_uuid, order);
      toast.success("Pedido realizado com sucesso!");
      // It's good practice to clear the cart after a successful order
      // await cartService.clearCart(user_uuid); // Assuming a clearCart function exists
      router.push("/orders");
    } catch (err) {
      toast.error("Erro ao finalizar pedido.");
    } finally {
      setIsPlacingOrder(false); // Stop loading for placing order
    }
  };

  useEffect(() => {
    if (user_uuid) { // Fetch cart only if user_uuid is available
      fetchCart();
    } else if (user === null) { // If user is explicitly null (not just initial state), means not logged in or data cleared
      // Potentially redirect to login if user data is definitively not available after initial load
      // For now, this relies on getCart to handle redirection if user_uuid is missing.
    }
  }, [user_uuid, user]); // Add user to dependency array to re-evaluate if user object changes

  if (loading) {
    return <div className="p-8 bg-[#FFFAF5] min-h-screen flex justify-center items-center">Carregando...</div>;
  }

  const orderTotal = cart.cartItem?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ) || 0;

  const orderItems = cart.cartItem?.map(item => ({
    title: item.book.title,
    author: Array.isArray(item.book.authors) ? item.book.authors.join(", ") : item.book.authors, // Join author names if array
    quantity: item.quantity,
    price: item.price,
    image: item.book.image_url || "/placeholder-image.png", // Assuming image_url exists
  })) || [];

  return (
    <div className="p-8 bg-[#FFFAF5] min-h-screen flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-4">
          <AddressForm onSelectAddress={setSelectedAddressId} /> {/* Assuming AddressForm will be updated to accept this prop */}
          <PaymentMethods
            selected={paymentMethod}
            onChange={setPaymentMethod}
          />
          {paymentMethod === "CARTÃO DE CRÉDITO" && (
            <SavedCards
              cards={userCards} // Pass fetched cards
              selected={selectedCard}
              onSelect={setSelectedCard}
            />
          )}
        </div>
        <div className="col-span-1 bg-white p-6 rounded-lg shadow flex flex-col gap-4 h-fit">
          <OrderReview items={orderItems} />
          <ConfirmOrder total={orderTotal} onConfirm={handleConfirm} isLoading={isPlacingOrder} />
        </div>
      </div>
    </div>
  );
}
