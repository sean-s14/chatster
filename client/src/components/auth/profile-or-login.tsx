import Profile from "@/components/auth/profile";
import LoginButton from "@/components/auth/login-btn";
import SignupButton from "@/components/auth/signup-btn";
import Spinner from "@/components/spinner";
import useAuthCheck from "@/hooks/use-auth-check";
import decodeAccessToken from "@/utils/auth/decode-access-token";

export default function ProfileOrLogin() {
  const { isAuthenticated, isLoading } = useAuthCheck();

  if (isLoading) {
    return (
      <div className="flex items-center">
        <Spinner size={24} borderSize={2} />
      </div>
    );
  }

  const user = decodeAccessToken();
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
