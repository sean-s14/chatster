import { Button, ButtonProps } from "@/components/shadcn/ui/button";
import { useAuth } from "@/context/auth-context";

export default function LogoutButton(props: ButtonProps) {
  const { logout } = useAuth();

  return (
    <Button {...props} onClick={() => logout()}>
      Log Out
    </Button>
  );
}
