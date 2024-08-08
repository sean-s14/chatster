import { User } from "@auth0/auth0-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/shadcn/ui/dropdown-menu";
import { Button } from "@/components/shadcn/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/ui/avatar";
import LogoutButton from "@/components/auth/logout-btn";
import { Link } from "react-router-dom";

export default function Profile({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-10 h-10 rounded-full">
          <Avatar className="w-10 h-10 rounded-full">
            <AvatarImage alt="Avatar" src={user?.picture} />
            <AvatarFallback>
              <img
                src="/profile-picture.png"
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="line-through">Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <LogoutButton className="w-full justify-start" variant={"ghost"} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
