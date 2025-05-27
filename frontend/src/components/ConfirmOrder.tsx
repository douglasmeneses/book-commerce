"use client";

export default function ConfirmOrder({
  total,
  onConfirm,
  isLoading, // Add isLoading prop
}: {
  total: number;
  onConfirm: () => void;
  isLoading?: boolean; // Make isLoading optional
}) {
  return (
    <div className="p-4 bg-white rounded shadow h-fit">
      <button
        onClick={onConfirm}
        className={`bg-orange-500 text-white font-bold w-full py-2 rounded ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? "Processando..." : "Confirmar Compra"} {/* Change text when loading */}
      </button>
      <p className="mt-2 font-semibold">Total do pedido: R$ {total.toFixed(2)}</p>
    </div>
  );
}
