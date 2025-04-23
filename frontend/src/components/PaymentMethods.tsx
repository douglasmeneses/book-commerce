"use client";

const methods = ["CARTÃO DE CRÉDITO", "CARTÃO DE DÉBITO", "PIX", "BOLETO", "DINHEIRO"];

export default function PaymentMethods({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (method: string) => void;
}) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold mb-2">Pagamento</h2>
      <div className="grid grid-cols-3 gap-2">
        {methods.map((method) => (
          <button
            key={method}
            onClick={() => onChange(method)}
            className={`p-2 rounded border ${
              selected === method ? "bg-orange-300" : "bg-gray-200"
            }`}
          >
            {method}
          </button>
        ))}
      </div>
    </div>
  );
}
