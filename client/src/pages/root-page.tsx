import Navigation from "@/components/navigation/navigation";
import { Outlet } from "react-router-dom";

export default function RootPage() {
  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  );
}
