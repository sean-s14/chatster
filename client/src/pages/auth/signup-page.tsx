import { Card } from "@/components/shadcn/ui/card";
import SignupForm from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-96 p-8">
        <SignupForm />
      </Card>
    </div>
  );
}
