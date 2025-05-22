"use client";

import { useEffect, useState } from "react";
import OrderList from "@/components/OrderList";
import { getOrdersByUser } from "@/services/orderService";
import { toast } from "sonner";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = localStorage.getItem("user");
        const user_uuid = user ? JSON.parse(user).uuid : null;
        if (!user_uuid) {
          toast.error("Você precisa estar logado para acessar seus pedidos.");
          return;
        }

        const response = await getOrdersByUser(user_uuid);
        setOrders(response);
      } catch (error) {
        toast.error("Erro ao carregar pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return <OrderList orders={orders} />;
}
