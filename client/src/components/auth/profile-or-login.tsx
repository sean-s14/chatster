import Profile from "@/components/auth/profile";
import LoginButton from "@/components/auth/login-btn";
import SignupButton from "@/components/auth/signup-btn";
import Spinner from "@/components/spinner";
import { useAuth } from "@/context/auth-context";
import useAuthCheck from "@/hooks/useAuthCheck";

export default function ProfileOrLogin() {
  const { isAuthenticated, isLoading } = useAuthCheck();
  const { user } = useAuth();

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

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="flex gap-2">
        <LoginButton />
        <SignupButton />
      </div>
    );
  }

  return null;
}
