import Image from "next/image"


const books = [
    {
        id: 1,
        title: "Title",
        author: "Author",
        price: "R$ 39,90",
        quantity: 1,
        image: "/book.png",
    },
    {
        id: 2,
        title: "Title",
        author: "Author",
        price: "R$ 39,90",
        quantity: 1,
        image: "/book.png",
    },
]

export default function RevisarPedido() {
    return (
        <div className="bg-white max-w-4xl mx-auto mt-10 p-8 rounded-2xl shadow-md">
            <h2 className="text-lg font-bold mb-6">Revisar pedido</h2>
            <div className="space-y-6">
                {books.map((book) => (
                    <div key={book.id} className="flex items-start gap-6">
                        <Image
                            src={book.image}
                            alt={book.title}
                            width={100}
                            height={140}
                            className="rounded-md object-cover"
                        />
                        <div className="flex flex-col justify-between">
                            <div>
                                <p className="text-base font-semibold">{book.title}</p>
                                <p className="text-sm text-gray-600">{book.author}</p>
                            </div>
                            <div className="mt-4">
                                <p className="text-base font-bold">{book.price}</p>
                                <p className="text-sm">
                                    <span className="font-bold">Quantidade:</span> {book.quantity}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
