import Navigation from "@/components/navigation/navigation";
import { Outlet } from "react-router-dom";
import BackButton from "@/components/back-button";

export default function RootPage() {
  return (
    <div>
      <Navigation />
      <BackButton />
      <Outlet />
    </div>
  );
}
