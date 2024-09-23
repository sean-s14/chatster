import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "@/pages/router-config";
import { Toaster } from "@/components/shadcn/ui/toaster";

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
