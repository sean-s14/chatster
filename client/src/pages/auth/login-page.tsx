import { Card } from "@/components/shadcn/ui/card";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-96 p-8">
        <LoginForm />
      </Card>
    </div>
  );
}
