import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserProfileCard from "@/components/UserProfileCard";
import { User } from "@/types/userTypes";

export default function ProfileHeaderInfos({ user }: { user: User | null }) {
  return (
    <div className="flex flex-row justify-center items-center gap-4 mt-8 mb-4 relative z-[10] min-w-500px">
      <Button
        type="submit"
        className="w-auto min-w-[170px] bg-[#e67e22] text-white"
      >
        PEDIDOS
      </Button>
      <UserProfileCard user={user} className="relative z-[10]" />
      <div className="flex flex-col items-center">
        <Link href={"/profile/update"}>
          <Button
            type="submit"
            className="w-auto min-w-[180px] bg-[#e67e22] text-white mb-8"
          >
            ATUALIZAR DADOS
          </Button>
        </Link>
        <Button
          type="submit"
          variant={"outline"}
          className="w-auto min-w-[180px] border border-[#e67e22] text-[#e67e22] hover:bg-[#e67e22] hover:text-white"
        >
          EDITAR ENDEREÇOS
        </Button>
      </div>
    </div>
  );
}
