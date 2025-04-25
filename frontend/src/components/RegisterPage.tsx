"use client";

import { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { registerUser } from "@/services/userServices";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    cpf: "",
    phone: "",
  });

  const router = useRouter();
  const { toast } = useToast();

  const handleNextStep = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleRegister = async (data: {
    name: string;
    birthDate: string;
    cpf: string;
    phone: string;
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));

    try {
      const response = await registerUser({ ...formData, ...data });
      toast({
        title: "Sucesso!",
        description: "Usuário cadastrado com sucesso!",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      error instanceof Error ? error.message : "Erro ao registrar usuário";
      toast({
        title: "Erro",
        description: "Erro ao registrar usuário",
        variant: "destructive",
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
      <div className="w-full max-w-xl space-y-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
            >
              <StepOne defaultValues={formData} onNext={handleNextStep} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 1, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
            >
              <StepTwo
                defaultValues={formData}
                onPrevious={handlePreviousStep}
                onSubmit={handleRegister}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
