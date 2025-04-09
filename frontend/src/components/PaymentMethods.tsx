import { Button } from "@/components/ui/button"
import { CreditCard, Barcode, DollarSign } from "lucide-react"

const methods = [
  { label: "Cartão de Crédito", icon: CreditCard },
  { label: "Pix", icon: DollarSign },
  { label: "Boleto", icon: Barcode },
]

export default function PaymentMethods() {
  return (
    <div className="relative" style={{ width: '996px', height: '256px', left: '40px' }}>
      <div className="bg-white p-6 rounded-xl shadow-md" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
        <h2 className="font-bold mb-4 text-lg">Pagamento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {methods.map(({ label, icon: Icon }, idx) => (
            <Button
              key={idx}
              variant="outline"
              className={`justify-start gap-2 px-4 py-6 text-sm font-semibold text-black bg-muted hover:bg-muted/80 rounded-md border-orange-300 border-2 ${idx === 0 ? "bg-orange-100" : ""}`}
            >
              <Icon className="w-4 h-4 text-orange-500" />
              {label.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
