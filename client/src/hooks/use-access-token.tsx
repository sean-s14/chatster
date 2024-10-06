import { useState, useEffect } from "react";

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem("accessToken") || null;
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "accessToken") {
        setAccessToken(event.newValue);
      }
    };

    const handleAccessTokenUpdate = () => {
      const updatedToken = localStorage.getItem("accessToken");
      setAccessToken(updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("accessTokenUpdated", handleAccessTokenUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("accessTokenUpdated", handleAccessTokenUpdate);
    };
  }, []);

  return [accessToken, setAccessToken] as const;
};
