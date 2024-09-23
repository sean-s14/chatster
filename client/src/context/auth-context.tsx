import React, { createContext, useContext, useState, useEffect } from "react";
import createAxiosInstance from "@/utils/axios-config";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { logout as logoutService } from "@/services/logout";
import { refreshAccessToken as refreshAccessTokenService } from "@/services/refresh-access-token";

export interface AccessTokenPayload extends JwtPayload {
  id: number | string;
  email: string;
  username: string;
  name?: string;
  image?: string;
  role: string;
}

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  user: AccessTokenPayload | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const axiosInstance = createAxiosInstance();

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AccessTokenPayload | null>(null);

  useEffect(() => {
    async function fetchToken() {
      const token = await refreshAccessToken();
      if (token) setAccessToken(token);
    }
    if (!accessToken) fetchToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      const decodedToken = jwtDecode<AccessTokenPayload>(accessToken);
      if (decodedToken) {
        setUser(decodedToken);
      }
    }
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/login",
        { email, password },
        {
          withCredentials: true,
        }
      );
      setAccessToken(response.data.accessToken);
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutService(axiosInstance);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    // To prevent refresh token from being used after logout
    setTimeout(() => {
      setAccessToken(null);
    }, 100);
    setUser(null);
  };

  const refreshAccessToken = async () => {
    try {
      const newAccessToken = await refreshAccessTokenService(axiosInstance);
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        login,
        logout,
        refreshAccessToken,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
