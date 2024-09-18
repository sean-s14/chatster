import RootPage from "@/pages/root-page";
import ErrorPage from "@/pages/error-page";
import HomePage from "@/pages/home-page";
import SettingsPage from "@/pages/settings-page";
import ProtectedComponent from "@/components/auth/protected-component";
import LoginPage from "@/pages/auth/login-page";
import SignupPage from "@/pages/auth/signup-page";

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
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/settings",
        element: <ProtectedComponent Component={SettingsPage} />,
      },
    ],
  },
];

export default routes;
