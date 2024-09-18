import React from "react";
import { Button } from "@/components/shadcn/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/shadcn/ui/card";
import { useNavigate } from "react-router-dom";
import constants from "@/styles/constants";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ height: `calc(100vh - ${constants.NAV_HEIGHT}px)` }}
    >
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Unauthorized Access</CardTitle>
          <CardDescription>
            You don't have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Please contact your administrator if you believe this is an error.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGoBack} className="w-full">
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
