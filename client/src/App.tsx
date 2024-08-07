import Navigation from "@/components/navigation/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Auth0Provider } from "@auth0/auth0-react";

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
        <Navigation />
        <h1 className="text-3xl font-bold underline text-center mt-4">
          Auth0 Setup Complete!
        </h1>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
