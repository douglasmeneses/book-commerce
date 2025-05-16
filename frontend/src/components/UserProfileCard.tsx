"use client";

import { useState, useEffect } from "react";
import { CircleUserRound } from "lucide-react";
import { LoaderCircle } from "lucide-react";

import { User, Address } from "@/types/userTypes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export default function UserProfileCard({
  user,
  className,
}: {
  user: User | null;
  className?: string;
}) {
  const dateFormater = (date: string | Date) => {
    const data = dayjs(date).format("DD [de] MMMM [de] YYYY");
    return data;
  };

  const [userData, setUserData] = useState<User | null>(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUserData(user);
    }, 1000);
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [user]);

  return (
    <Card
      className={`w-auto min-w-[500px] bg-[#FFFFFF] justify-center items-center text-[#241400] min-h-[250px] ${className}`}
    >
      {userData === null ? (
        <CardHeader className="flex flex-row items-center gap-2 justify-center  w-full mt-[50px]">
          <LoaderCircle className="animate-spin w-12 h-12 text-[#E16A00] " />
          <CardTitle className="text-2xl font-bold text-[#241400]">
            Carregando...
          </CardTitle>
        </CardHeader>
      ) : (
        <>
          <CardHeader className="flex flex-row items-center gap-6 px-8 justify-start">
            <Avatar className="w-24 h-auto text-[#E16A00]">
              <AvatarImage src={userData?.avatar || ""} />
              <AvatarFallback>
                <CircleUserRound className="w-24 h-24 bg-[#FFFFFF]" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-4xl font-bold text-[#241400]">
              {userData?.username || "Unknown"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-[max-content_1fr] gap-y-2 gap-x-4 ml-4 w-full px-8 ">
            <p className="font-semibold text-sm text-[#241400]">Nome:</p>
            <p className="text-sm text-[#241400]">{userData?.name || "N/A"}</p>
            <p className="font-semibold text-sm text-[#241400]">Email:</p>
            <p className="text-sm text-[#241400]">{userData?.email || "N/A"}</p>
            <p className="font-semibold text-sm text-[#241400]">Endereço:</p>
            <p className="text-sm text-[#241400]">
              {userData?.address &&
              userData.address.street &&
              userData.address.number &&
              userData.address.city &&
              userData.address.state
                ? `${userData.address.street}, ${userData.address.number}, ${userData.address.city} - ${userData.address.state}`
                : "N/A"}
            </p>

            <p className="font-semibold text-sm text-[#241400]">
              Data de criação:
            </p>
            <p className="text-sm text-[#241400]">
              {userData?.created_at ? dateFormater(userData.created_at) : "N/A"}
            </p>
          </CardContent>
        </>
      )}
    </Card>
  );
}
