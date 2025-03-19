import Link from "next/link";
import { Button } from "./ui/button";
import { Heart, CircleUserRound, ShoppingCart } from "lucide-react";
import { SearchBar } from "./SearchBar";

export default function NavBar() {
  return (
    <nav className="navbar w-5/6 mx-auto px-4 py-2 rounded-md mt-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="navbar-brand">
          <img
            src="/logoHome.png"
            alt="Logo"
            width="200"
            height="40"
            className="d-inline-block align-text-top"
          />
        </Link>

        <div className="flex items-center ml-auto">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-1 ml-auto">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost">Cadastre-se</Button>
          </Link>
          <div className="flex gap-[14px]">
            <Heart
              size={30}
              color="#E16A00"
              className="cursor-pointer p-1 hover:bg-gray-100 rounded-full"
            />
            <ShoppingCart
              size={30}
              color="#E16A00"
              className="cursor-pointer p-1 hover:bg-gray-100 rounded-full"
            />
            <CircleUserRound
              size={30}
              color="#E16A00"
              className="cursor-pointer p-1 hover:bg-gray-100 rounded-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
