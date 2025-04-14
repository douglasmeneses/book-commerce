"use client";

interface Card {
  id: number;
  number: string;
  balance: number;
  expiry: string;
  color: string; 
}

export default function SavedCards({
  cards,
  selected,
  onSelect,
}: {
  cards: Card[];
  selected: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold mb-4">Cartões</h2>
      <div className="flex gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelect(card.id)}
            className={`w-48 h-28 p-4 rounded-lg cursor-pointer relative ${
              card.color === 'red' ? 'bg-red-500' : 'bg-purple-600'
            } ${
              selected === card.id ? "ring-2 ring-orange-500" : ""
            }`}
          >
            <div className="flex flex-col h-full justify-between">
              <p className="text-xs text-white opacity-80">Current Balance</p>
              <p className="text-lg font-bold text-white">
                ${card.balance.toFixed(2)}
              </p>
              <div className="flex justify-between items-end">
                <p className="text-xs text-white opacity-80">{card.number}</p>
                <p className="text-xs text-white opacity-80">{card.expiry}</p>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <div className="w-8 h-5 bg-yellow-500 rounded-full opacity-80"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}