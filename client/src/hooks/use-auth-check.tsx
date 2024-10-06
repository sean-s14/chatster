import { useEffect, useState } from "react";
import refreshAccessToken from "@/services/auth/refresh-access-token";
import { useAccessToken } from "./use-access-token";

const useAuthCheck = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken] = useAccessToken();

  useEffect(() => {
    const checkAuth = async () => {
      if (!accessToken) {
        try {
          const {
            data: { accessToken: newToken },
          } = await refreshAccessToken();
          if (newToken) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Failed to refresh access token:", error);
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
