"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Heart, CircleUserRound, ShoppingCart } from "lucide-react";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="navbar w-3/4 mx-auto px-4 py-2 rounded-md mt-4">
      <div className="container flex items-center justify-between">
        <Link href="/home" className="navbar-brand">
          <img
            src="/logoHome.png"
            alt="Logo"
            width="200"
            height="50"
            className="d-inline-block align-text-top"
          />
        </Link>

        <form
          onSubmit={handleSearch}
          className="mx-4 flex-grow w-full flex justify-center relative"
        >
          <SearchIcon
            className="relative top-2 left-7 cursor-pointer text-[#241400]"
            onClick={handleSearch}
          />
          <input
            placeholder="Procurar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/2 pl-10 py-2 border-b border-zinc-300 focus:outline-none focus:ring-0 focus:border-b-1    focus:border-orange-500"
          />
        </form>

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
