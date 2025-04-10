import LoginPage from "@/components/LoginForm";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-12 shadow-md">
        <LoginPage />
      </div>
    </main>
  );
}
