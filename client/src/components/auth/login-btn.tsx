import { Button } from "@/components/shadcn/ui/button";
import { Link } from "react-router-dom";

export default function LoginButton() {
  return (
    <Link to="/login" className="w-full h-full">
      <Button id="login-btn" variant={"ghost"}>
        Login
      </Button>
    </Link>
  );
}
