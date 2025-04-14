"use client";

interface Item {
  title: string;
  author: string;
  quantity: number;
  price: number;
  image: string;
}

export default function OrderReview({ items }: { items: Item[] }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold mb-2">Revisar pedido</h2>
      {items.map((item, index) => (
        <div key={index} className="flex gap-4 mb-4">
          <img src={item.image} alt={item.title} className="w-16 h-24" />
          <div>
            <p className="font-semibold">Title</p>
            <p>{item.author}</p>
            <p>
            <strong>R$ {Number(item.price).toFixed(2)}</strong>

            </p>
            <p>
              <strong>Quantidade:</strong> {item.quantity}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
