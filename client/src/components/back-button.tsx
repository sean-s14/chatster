import { useNavigate } from "react-router-dom";
import { Button } from "@/components/shadcn/ui/button";
import { useLocation } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton =
    location.key !== "default" && location.pathname !== "/";
  if (!showBackButton) return null;

  return (
    <div className="w-full flex justify-start px-4 py-4">
      <Button onClick={() => navigate(-1)} variant={"outline"}>
        Go Back
      </Button>
    </div>
  );
}
