"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

import DeleteUserButton from "@/components/DeleteUserButton";
import {
  getUserByUuid,
  updateUserProfile,
  uploadUserAvatar,
} from "@/services/userServices";
import { getUserInLocalStorageItem } from "@/utils/localStorageUtils";

const profileUpdateSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").optional(),
  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
    .optional(),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[@$!%*?&.]/, "A senha deve conter pelo menos um caractere especial")
    .optional(),
  phone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido")
    .optional(),
  cpf: z
    .string()
    .length(14, "O CPF deve ter 11 dígitos")
    .refine((value) => cpfValidator.isValid(value), {
      message: "CPF inválido",
    })
    .optional(),
  birth_date: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), "Data de nascimento inválida")
    .optional(),
  avatar: z.any().optional(),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export default function ProfileUpdatePage() {
  const router = useRouter();
  const [userUuid, setUserUuid] = useState("");
  const [formData, setFormData] = useState<ProfileUpdateForm>({
    name: "",
    username: "",
    password: "",
    phone: "",
    cpf: "",
    birth_date: "",
    avatar: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedUser = getUserInLocalStorageItem();
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUserUuid(parsedUser?.uuid || "");
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userUuid) return;

      try {
        const response = await getUserByUuid(userUuid);
        const user = response.user;
        console.log("Dados do usuário:", user);
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          username: user.username || "",
          phone: user.phone || "",
          cpf: user.cpf || "",
          birth_date: user.birth_date?.split("T")[0] || "",
          avatar: user.avatar || "",
        }));
      } catch {
        toast.error("Erro ao carregar os dados do usuário.");
      }
    };

    fetchUser();
  }, [userUuid]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = profileUpdateSchema.safeParse(formData);
    if (!result.success) {
      const zodErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          zodErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(zodErrors);
      return;
    }

    try {
      if (formData.avatar instanceof File) {
        const avatarResponse = await uploadUserAvatar(
          userUuid,
          formData.avatar
        );
        console.log("Avatar atualizado:", avatarResponse);
        if (avatarResponse.error) {
          toast.error("Erro ao atualizar o avatar.");
          return;
        }
      }

      // Remove o avatar dos dados antes de enviar o restante
      const { avatar, ...rest } = formData;

      const filteredData = Object.fromEntries(
        Object.entries(rest).filter(([_, value]) => value)
      );

      console.log("Dados atualizados (sem avatar):", filteredData);

      await updateUserProfile(userUuid, filteredData);
      toast.success("Perfil atualizado com sucesso!");
      router.push("/profile");
    } catch (error) {
      toast.error("Erro ao atualizar o perfil.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex justify-between items-center gap-8 mb-4">
          <h1 className="text-3xl font-bold mb-6 text-[#241400]">
            Atualizar Dados
          </h1>

          <div className="flex items-center gap-4">
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="border border-[#E16A0099] rounded-md p-2 mb-4 w-80 text-[#E16A00]"
            />
            {errors.avatar && (
              <p className="text-red-500 text-sm">{errors.avatar}</p>
            )}

            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage
                src={
                  formData.avatar instanceof File
                    ? URL.createObjectURL(formData.avatar)
                    : formData.avatar || undefined
                }
              />
              <AvatarFallback className="bg-gray-200 text-gray-500">
                {formData.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="border border-[#E16A0099] rounded-md p-2 mb-4"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <Label htmlFor="username">Apelido</Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="border border-[#E16A0099] rounded-md p-2 mb-4"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}

          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-[#E16A0099] rounded-md p-2 mb-4"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            className="border border-[#E16A0099] rounded-md p-2 mb-4"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}

          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            type="text"
            value={formData.cpf}
            onChange={handleChange}
            className="border border-[#E16A0099] rounded-md p-2 mb-4"
          />
          {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf}</p>}

          <Label htmlFor="birth_date">Data de Nascimento</Label>
          <Input
            id="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            className="border border-[#E16A0099] rounded-md p-2 mb-4"
          />
          {errors.birth_date && (
            <p className="text-red-500 text-sm">{errors.birth_date}</p>
          )}
        </div>

        <div className="flex justify-center items-center gap-4">
          <Button
            type="submit"
            className="w-80 bg-[#e67e22] text-white mt-10 mb-8"
          >
            Salvar Dados <Save />
          </Button>
          <DeleteUserButton user_uuid={userUuid} />
        </div>
      </form>
    </div>
  );
}
