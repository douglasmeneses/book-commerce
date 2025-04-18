import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { User, IdCard, Phone, Calendar } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

const stepTwoZodSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  birthDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Data de nascimento inválida",
  }),
  cpf: z
    .string()
    .length(14, "O CPF deve ter 11 dígitos")
    .refine((value) => cpfValidator.isValid(value), {
      message: "CPF inválido",
    }),
  phone: z
    .string()
    .regex(
      /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
      "O telefone deve estar no formato (11) 91234-5678"
    ),
});

export default function StepTwo({
  defaultValues,
  onPrevious,
  onSubmit,
}: {
  defaultValues: {
    name: string;
    birthDate: string;
    cpf: string;
    phone: string;
  };
  onPrevious: () => void;
  onSubmit: (data: {
    name: string;
    birthDate: string;
    cpf: string;
    phone: string;
  }) => void;
}) {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(stepTwoZodSchema),
  });

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const cleanCPF = (cpf: string) => cpf.replace(/\D/g, "");

  const handleSubmit = (data: {
    name: string;
    birthDate: string;
    cpf: string;
    phone: string;
  }) => {
    const payload = {
      ...data,
      cpf: cleanCPF(data.cpf),
    };
    onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <Label htmlFor="name" className="mb-1 block">
                Nome
              </Label>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="name"
                    className="pl-10 bg-gray-100 border-none h-12"
                    placeholder="João Pedro"
                    type="text"
                    required
                    {...field}
                  />
                </div>
              </FormControl>
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field, fieldState }) => (
            <FormItem>
              <Label htmlFor="birthDate" className="mb-1 block">
                Data de Nascimento
              </Label>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="birthDate"
                    className="pl-10 bg-gray-100 border-none h-12"
                    placeholder="DD/MM/AAAA"
                    type="date"
                    required
                    {...field}
                  />
                </div>
              </FormControl>
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field, fieldState }) => (
            <FormItem>
              <Label htmlFor="cpf" className="mb-1 block">
                CPF
              </Label>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <IdCard className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="cpf"
                    className="pl-10 bg-gray-100 border-none h-12"
                    placeholder="123.456.789-00"
                    type="text"
                    value={field.value}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </div>
              </FormControl>
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <FormItem>
              <Label htmlFor="phone" className="mb-1 block">
                Telefone
              </Label>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="phone"
                    className="pl-10 bg-gray-100 border-none h-12"
                    placeholder="(11) 91234-5678"
                    type="text"
                    required
                    {...field}
                  />
                </div>
              </FormControl>
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button
            type="submit"
            className=" w-80 h-12 bg-[#e67e22] hover:bg-[#d35400] text-white font-medium"
          >
            Cadastrar
          </Button>
          <Button
            type="button"
            className=" w-20 h-12 bg-[#e67e22] hover:bg-[#d35400] text-white font-medium"
            onClick={onPrevious}
          >
            Voltar
          </Button>
        </div>
      </form>
    </Form>
  );
}
