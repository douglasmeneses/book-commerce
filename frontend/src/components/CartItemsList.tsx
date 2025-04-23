import Image from "next/image";
import { Cart, CartItem } from "@/types/cartTypes";
import QuantitySelectorButtons from "@/components/QuantitySelectorButtons";
import { sortCartItems } from "@/utils/cartUtils";

interface CartItemsListProps {
  user_uuid: string;
  cart: Cart;
  handleAddItem: (
    user_uuid: string,
    book_uuid: string,
    quantity: number
  ) => Promise<void>;
  handleRemoveItem: (
    user_uuid: string,
    cartItem_id: number,
    quantity: number
  ) => Promise<void>;
  handleDeleteItem: (cartItem_id: number, user_uuid: string) => Promise<void>;
}

export default function CartItemsList({
  user_uuid,
  cart,
  handleAddItem,
  handleRemoveItem,
  handleDeleteItem,
}: CartItemsListProps) {
  const sortedCartItems = sortCartItems(cart.cartItem);
  return (
    <div className="BooksArray flex w-[70%] mt-[5vh]">
      <ul className="w-full">
        <li className="mb-4 font-bold flex justify-between bg-white rounded shadow-md p-[2vh] px-[10vh] text-[1.4rem]">
          <span>Book</span>
          <span>Total</span>
        </li>
        <div className="max-h-[80vh] overflow-y-auto">
          {sortedCartItems?.map((item: CartItem) => (
            <li
              key={item.id}
              className="flex border-b py-2 mb-4 bg-white rounded shadow-md p-[2vh] px-[3vh]"
            >
              <span>
                <Image
                  src={item.book.image_url || "/livro-1.png"}
                  alt={item.book.title || "Book image"}
                  width={200}
                  height={200}
                ></Image>
              </span>
              <span className="flex w-full">
                <div className="w-full flex justify-between flex-col ml-[2vh]">
                  <div>
                    <h2 className="text-[2rem] font-bold">{item.book.title}</h2>
                    <p className="text-[1rem] text-gray-500">
                      {item.book.authors.map((name) => name).join(", ")}
                    </p>
                    <p>
                      {item.book.stock_quantity > 0 ? (
                        <span className="text-green-500">Em estoque</span>
                      ) : (
                        <span className="text-red-500">Esgotado</span>
                      )}
                    </p>
                  </div>
                  <QuantitySelectorButtons
                    user_uuid={user_uuid}
                    item={item}
                    handleAddItem={handleAddItem}
                    handleRemoveItem={handleRemoveItem}
                    handleDeleteItem={handleDeleteItem}
                  />
                </div>
              </span>

              <span className="moz- items-center w-[10%] max-w-[10%]">
                <p>
                  <strong>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.price || 0)}
                  </strong>
                </p>
              </span>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
}
