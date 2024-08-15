import RootPage from "@/pages/root-page";
import ErrorPage from "@/pages/error-page";
import HomePage from "@/pages/home-page";
import SettingsPage from "@/pages/settings-page";
import { AuthenticationGuard } from "@/components/auth/authentication-guard";

const routes = [
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/settings",
        element: (
          <AuthenticationGuard
            component={SettingsPage}
            options={{ returnTo: "/settings" }}
          />
        ),
      },
    ],
  },
];

export default routes;
