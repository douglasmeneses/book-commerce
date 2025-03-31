"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { registerUser } from "@/services/userServices";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const handleRegister = async () => {
    try {
      const response = await registerUser(form.getValues());
      toast({
        title: "Success",
        description: "User registered successfully",
      });
      toast({
        title: "Bem vindo!",
        description: `Bem vindo, ${response.user.name}`,
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error while register user";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        action: <ToastAction altText="Close">Fechar</ToastAction>,
      });
    }
  };

  return (
    <div className="w-full max-w-xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">
          Registre sua conta na{" "}
          <span className="text-[#e67e22]">BookStore</span>
        </h1>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleRegister)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="name" className="mb-1 block">
                  Nome{" "}
                </Label>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      id="name"
                      className="pl-10 bg-gray-100 border border-gray-300 h-12"
                      placeholder="João"
                      type="text"
                      required
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="username" className="mb-1 block">
                  Username{" "}
                </Label>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      id="username"
                      className="pl-10 bg-gray-100 border border-gray-300 h-12"
                      placeholder="João123"
                      type="text"
                      required
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email" className="mb-1 block">
                  Email
                </Label>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      id="email"
                      className="pl-10 bg-gray-100 border-none h-12"
                      placeholder="seuemail@gmail.com"
                      type="email"
                      required
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password" className="mb-1 block">
                  Senha
                </Label>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none focus:border-[#e67e22]">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      id="password"
                      className="pl-10 bg-gray-100 border-none h-12"
                      placeholder="••••••••••"
                      type={showPassword ? "text" : "password"}
                      required
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 bg-[#e67e22] hover:bg-[#d35400] text-white font-medium"
          >
            Cadastrar
          </Button>

          <div className="text-center text-sm text-gray-500">
            Já possui uma conta?{" "}
            <a href="/register" className="text-[#e67e22]">
              Login
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
}
