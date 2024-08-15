import { withAuthenticationRequired } from "@auth0/auth0-react";
import LoadingPage from "@/pages/loading-page";
import { WithAuthenticationRequiredOptions } from "@auth0/auth0-react";

export const AuthenticationGuard = ({
  component,
  options,
}: {
  component: React.ComponentType;
  options: WithAuthenticationRequiredOptions;
}) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <LoadingPage />,
    ...options,
  });

  return <Component />;
};
