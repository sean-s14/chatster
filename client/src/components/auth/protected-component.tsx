import React from "react";
import useAuthCheck from "@/hooks/useAuthCheck";
import LoadingPage from "@/pages/loading-page";
import { Navigate } from "react-router-dom";

interface AuthenticationGuardProps {
  Component: React.ComponentType<any>;
}

const ProtectedComponent: React.FC<AuthenticationGuardProps> = ({
  Component,
}) => {
  const { isAuthenticated, isLoading } = useAuthCheck();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default ProtectedComponent;
