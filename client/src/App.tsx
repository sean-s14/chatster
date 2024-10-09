import { ThemeProvider } from "@/components/theme-provider";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "@/pages/router-config";
import { Toaster } from "@/components/shadcn/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

const DEV = import.meta.env.MODE === "development";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
      {DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition={"bottom-left"}
        />
      )}
    </QueryClientProvider>
  );
}

export default App;
