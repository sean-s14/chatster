import { useAuth0 } from "@auth0/auth0-react";
import { Button, ButtonProps } from "@/components/shadcn/ui/button";

export default function LogoutButton(props: ButtonProps) {
  const { logout } = useAuth0();

  return (
    <Button
      {...props}
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out
    </Button>
  );
}
