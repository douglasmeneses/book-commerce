"use client";

import Image from "next/image";

interface OrderItem {
  image: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  items: OrderItem[];
}

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  return (
    <div className="p-8 bg-[#FFFAF5] min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Pedidos</h2>
      <div className="flex flex-col gap-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded shadow-md flex flex-col p-6 mb-2"
          >
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-6">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={120}
                    className="rounded"
                  />
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-gray-500">{item.author}</p>
                    <p className="mt-2">
                      <strong>R$ {item.price.toFixed(2)}</strong>
                    </p>
                    <p>
                      <strong>Quantidade:</strong> {item.quantity}
                    </p>
                  </div>
                </div>
                <button className="bg-[#E16A00] text-white font-bold px-8 py-2 rounded hover:bg-[#d35400] transition">
                  Rastrear Pacote
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
