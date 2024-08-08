import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  if (import.meta.env.DEV) console.error(error);

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    if (import.meta.env.DEV) console.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <div
      id="error-page"
      className="flex flex-col items-center pt-10 gap-2 text-xl"
    >
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="font-semibold">{errorMessage}</p>
    </div>
  );
}
