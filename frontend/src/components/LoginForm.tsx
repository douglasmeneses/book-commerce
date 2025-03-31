"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { loginUser } from "@/services/userServices";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await loginUser(data.email, data.password);
      localStorage.setItem("token", JSON.stringify(response.token));
      localStorage.setItem(
        "refreshToken",
        JSON.stringify(response.refreshToken)
      );
      localStorage.setItem("user", JSON.stringify(response.user));
      toast({
        title: "Success",
        description: "Login successfully",
      });
      toast({
        title: "Bem vindo!",
        description: `Bem vindo, ${response.user.name}`,
      });
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error while login user";
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
          Entre na sua conta da{" "}
          <span className="text-[#e67e22]">BookStore</span>
        </h1>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleLogin)}>
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
            Login
          </Button>

          <div className="text-center text-sm text-gray-500">
            Não tem uma conta?{" "}
            <a href="/register" className="text-[#e67e22]">
              Registre-se
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
}
