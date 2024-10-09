import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button } from "@/components/shadcn/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/shadcn/ui/alert";
import { AlertCircle } from "lucide-react";
import { log } from "@/utils/logging";

export default function ErrorPage() {
  const error = useRouteError();

  log.error(error);

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    log.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <div id="error-page" className="container mx-auto max-w-md pt-10">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          <p>Sorry, an unexpected error has occurred.</p>
          <p className="text-base font-semibold mt-2">{errorMessage}</p>
        </AlertDescription>
      </Alert>
      <div className="mt-4 text-center">
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go back to homepage
        </Button>
      </div>
    </div>
  );
}
