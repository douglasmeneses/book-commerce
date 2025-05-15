"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/services/userServices";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DeleteUserButton from "@/components/DeleteUserButton";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserInLocalStorageItem } from "@/utils/localStorageUtils";

const profileUpdateSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").optional(),
  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
    .optional(),
  password: z.string().optional(),
  phone: z
    .string()
    .regex(
      /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
      "O telefone deve estar no formato (11) 91234-5678"
    )
    .optional(),
  cpf: z
    .string()
    .length(11, "O CPF deve ter exatamente 11 dígitos")
    .regex(/^\d+$/, "O CPF deve conter apenas números")
    .optional(),
  birthDate: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), "Data de nascimento inválida")
    .optional(),
  avatar: z.any().optional(),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export default function ProfileUpdatePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [user_uuid, setUserUuid] = useState<string>("");

  useEffect(() => {
    const storedUser = getUserInLocalStorageItem();
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUserUuid(parsedUser?.uuid || "");
  }, []);

  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: "",
      username: "",
      phone: "",
      cpf: "",
      birthDate: "",
      avatar: undefined,
    },
  });

  const handleSubmit = async (data: ProfileUpdateForm) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username || "");
      formData.append("name", data.name || "");
      formData.append("password", data.password || "");
      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }
      formData.append("cpf", data.cpf || "");
      formData.append("phone", data.phone || "");
      formData.append("birthDate", data.birthDate || "");

      await updateUserProfile(user_uuid, formData);
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
      router.push("/profile");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
        encType="multipart/form-data"
      >
        <div className="flex flex-row justify-between items-center gap-8 mb-4">
          <h1 className="text-3xl font-bold mb-6 text-[#241400]">
            Atualizar Dados
          </h1>
          <div className="flex items-center gap-4">
            <Input
              id="avatar"
              className="border border-[#E16A0099] rounded-md p-2 mb-4 w-80 text-[#E16A00]"
              type="file"
              accept="image/*"
              {...form.register("avatar")}
            />
            {form.formState.errors.avatar && (
              <p className="text-red-500 text-sm">
                {typeof form.formState.errors.avatar.message === "string"
                  ? form.formState.errors.avatar.message
                  : "Erro no campo avatar"}
              </p>
            )}
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage alt="Avatar" />
              <AvatarFallback className="bg-gray-200 text-gray-500">
                {form.watch("name")?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" placeholder="Seu nome" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="username">Apelido</Label>
          <Input
            id="username"
            placeholder="Seu apelido de usuário"
            {...form.register("username")}
          />
          {form.formState.errors.username && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Sua senha"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            placeholder="(11) 91234-5678"
            {...form.register("phone")}
          />
          {form.formState.errors.phone && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" placeholder="12345678900" {...form.register("cpf")} />
          {form.formState.errors.cpf && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.cpf.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="birthDate">Data de Nascimento</Label>
          <Input id="birthDate" type="date" {...form.register("birthDate")} />
          {form.formState.errors.birthDate && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.birthDate.message}
            </p>
          )}
        </div>
        <div className="flex flex-row justify-center items-center gap-4">
          <Button
            type="submit"
            className="w-80 bg-[#e67e22] text-white mt-10 mb-8"
          >
            Salvar Dados
            <Save />
          </Button>
          <DeleteUserButton user_uuid={user_uuid} />
        </div>
      </form>
    </div>
  );
}
