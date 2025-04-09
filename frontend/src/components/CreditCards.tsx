import { Card, CardContent } from "@/components/ui/card"

const cards = [
  { color: "from-red-500 to-orange-500", number: "5282 3456 7890 1289", date: "09/25" },
  { color: "from-purple-600 to-blue-500", number: "5282 3456 7890 1289", date: "09/25" },
]

export default function CreditCards() {
  return (
    <div className="absolute left-[39px] top-[743px] w-[996px] h-[340px] rounded-lg bg-white p-4">
      <Card className="w-full h-full">
        <CardContent className="p-6 h-full flex flex-col">
          <h2 className="font-bold text-lg mb-6">Cartões</h2>
          <div className="flex flex-wrap gap-6 h-full">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-between rounded-xl text-white p-6 w-[48%] bg-gradient-to-r ${card.color}`}
              >
                <div>
                  <p className="text-sm">Current Balance</p>
                  <p className="text-xl font-semibold">$5,750.20</p>
                </div>
                <div className="flex justify-between text-xs mt-6">
                  <span>{card.number}</span>
                  <span>{card.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
