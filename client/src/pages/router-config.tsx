import RootPage from "@/pages/root-page";
import ErrorPage from "@/pages/error-page";
import HomePage from "@/pages/home-page";
import SettingsPage from "@/pages/settings-page";

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
        element: <SettingsPage />,
      },
    ],
  },
];

export default routes;
