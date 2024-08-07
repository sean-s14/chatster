import { ModeToggle } from "@/components/mode-toggle";
import ProfileOrLogin from "@/components/auth/profile-or-login";

export default function Navigation() {
  return (
    <nav className="h-16 px-6 flex justify-between items-center border-b-2">
      <h1 className="text-2xl font-bold">Chatster</h1>
      <div className="flex justify-between items-center gap-4">
        <ProfileOrLogin />
        <ModeToggle />
      </div>
    </nav>
  );
}
