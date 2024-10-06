import { Button, ButtonProps } from "@/components/shadcn/ui/button";
import logout from "@/services/auth/logout";

export default function LogoutButton(props: ButtonProps) {
  return (
    <Button {...props} onClick={() => logout()}>
      Log Out
    </Button>
  );
}
