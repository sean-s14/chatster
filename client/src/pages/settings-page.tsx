import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/shadcn/ui/avatar";

export default function SettingsPage() {
  const { user } = useAuth0();

  return (
    <div className="flex flex-col items-center pt-10">
      <Avatar className="w-24 h-24 rounded-full">
        <AvatarImage src={user?.picture} className="w-24 h-24" />
        <AvatarFallback>
          <img src="/profile-picture.png" alt="Avatar" />
        </AvatarFallback>
      </Avatar>
      <h1 className="text-3xl font-semibold my-10">Settings</h1>
      <div className="w-96 max-w-full text-lg gap-4 flex flex-col">
        <div className="flex gap-6">
          <p className="w-1/3 text-end">Name:</p>
          <p className="w-2/3 text-start text-blue-300">{user?.name}</p>
        </div>
        <div className="flex gap-6">
          <p className="w-1/3 text-end">Email:</p>
          <p className="w-2/3 text-start text-blue-300">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
