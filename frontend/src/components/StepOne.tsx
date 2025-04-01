import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { User, Mail } from "lucide-react";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function StepOne({
  defaultValues,
  onNext,
}: {
  defaultValues: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  onNext: (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    defaultValues,
  });

  const handleNext = (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    onNext(data);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleNext)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="username" className="mb-1 block">
                Apelido
              </Label>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none focus:border-[#e67e22]">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="username"
                    placeholder="João123"
                    className="pl-10 bg-gray-100 border-none h-12"
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
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none focus:border-[#e67e22]">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="email"
                    placeholder="seuemail@gmail.com"
                    className="pl-10 bg-gray-100 border-none h-12"
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="confirmPassword" className="mb-1 block">
                Confirmar Senha
              </Label>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none focus:border-[#e67e22]">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="confirmPassword"
                    className="pl-10 bg-gray-100 border-none h-12"
                    placeholder="••••••••••"
                    type="password"
                    required
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 bg-[#e67e22] hover:bg-[#d35400] text-white font-medium"
        >
          Próximo
        </Button>
      </form>
    </Form>
  );
}
