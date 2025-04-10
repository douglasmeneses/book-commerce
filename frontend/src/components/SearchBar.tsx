import { Input } from "./ui/input";
import { Search } from "lucide-react";

export const SearchBar = () => {
return (
    <div className="flex items-center border-b border-gray-300 pb-1 gap-2 w-[550px]">
        <Search size={20} className="text-gray-500" />
        <Input
            className="flex-1 px-2" 
            placeholder="Search"
            style={{ all: "unset",
                width: "100%",
             }}
        />
    </div>
);
};
