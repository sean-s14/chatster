import { ThemeProvider } from "@/components/theme-provider";
import { Auth0Provider } from "@auth0/auth0-react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "@/pages/router-config";

const router = createBrowserRouter(routes);

function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN!}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
