"use client";

export default function ConfirmOrder({
  total,
  onConfirm,
}: {
  total: number;
  onConfirm: () => void;
}) {
  return (
    <div className="p-4 bg-white rounded shadow h-fit">
      <button
        onClick={onConfirm}
        className="bg-orange-500 text-white font-bold w-full py-2 rounded"
      >
        Confirmar Compra
      </button>
      <p className="mt-2 font-semibold">Total do pedido: R$ {total.toFixed(2)}</p>
    </div>
  );
}
