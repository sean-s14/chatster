import Spinner from "@/components/spinner";
import constants from "@/styles/constants";

export default function LoadingPage() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ height: `calc(100vh - ${constants.NAV_HEIGHT}px)` }}
    >
      <Spinner size={100} borderSize={8} />
    </div>
  );
}
