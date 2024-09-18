import { Button } from "@/components/shadcn/ui/button";
import { Link } from "react-router-dom";

export default function SignupButton() {
  return (
    <Link to="/signup">
      <Button id="signup-btn" variant={"outline"}>
        Signup
      </Button>
    </Link>
  );
}
