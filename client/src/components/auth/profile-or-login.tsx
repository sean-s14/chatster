import { useAuth0 } from "@auth0/auth0-react";
import Profile from "@/components/auth/profile";
import LoginButton from "@/components/auth/login-btn";
import Spinner from "@/components/spinner";

export default function ProfileOrLogin() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center">
        <Spinner size={24} borderSize={2} />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Profile user={user} />;
  }

  return <LoginButton />;
}
