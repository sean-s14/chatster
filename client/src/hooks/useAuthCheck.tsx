import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";

const useAuthCheck = () => {
  const { accessToken, refreshAccessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!accessToken) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [accessToken, refreshAccessToken]);

  return { isAuthenticated, isLoading };
};

export default useAuthCheck;
