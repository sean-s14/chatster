import { AccessTokenPayload as User } from "@/types/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/shadcn/ui/dropdown-menu";
import { Button } from "@/components/shadcn/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/ui/avatar";
import LogoutButton from "@/components/auth/logout-btn";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import getFriendRequestCount from "@/services/friend-request-count";
import { log } from "@/utils/logging";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { FriendRequestTypeEnum as FRTypeEnum } from "@/types/api/friend-request-enums";

function FriendRequestCountBadge({
  count,
  isLoading,
  datatestid,
}: {
  count?: number;
  isLoading: boolean;
  datatestid?: string;
}) {
  if (isLoading) return <Skeleton className="w-5 h-5 rounded-full" />;

  if (!count || count <= 0) return null;

  if (count > 99) {
    count = 99;
  }

  return (
    <div
      className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
      data-testid={datatestid}
    >
      {count}
    </div>
  );
}

export default function Profile({ user }: { user: User }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["friendRequestCount"],
    queryFn: getFriendRequestCount,
  });

  if (isError) log.error(error);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-10 h-10 rounded-full">
          <Avatar className="w-10 h-10 rounded-full">
            <AvatarImage alt="Avatar" src={user?.image} />
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
        <DropdownMenuLabel>@{user?.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
        {/* TODO: Add support link */}
        <DropdownMenuItem disabled>Support</DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/friends" className="w-full">
            Friends
          </Link>
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Friend Requests</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Link
                    to="/friends/requests"
                    state={{
                      requestType: FRTypeEnum.SENT,
                    }}
                    className="w-full flex justify-between"
                  >
                    <span>Sent</span>
                    <FriendRequestCountBadge
                      datatestid="sent-friend-request-count"
                      count={data?.sentCount}
                      isLoading={isLoading}
                    />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    to="/friends/requests"
                    state={{
                      requestType: FRTypeEnum.RECEIVED,
                    }}
                    className="w-full flex justify-between"
                  >
                    <span>Received</span>
                    <FriendRequestCountBadge
                      datatestid="received-friend-request-count"
                      count={data?.receivedCount}
                      isLoading={isLoading}
                    />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    to="/friends/requests"
                    state={{
                      requestType: FRTypeEnum.ALL,
                    }}
                    className="w-full flex justify-between"
                  >
                    <span>All</span>
                    <FriendRequestCountBadge
                      datatestid="total-friend-request-count"
                      count={
                        (data?.sentCount || 0) + (data?.receivedCount || 0)
                      }
                      isLoading={isLoading}
                    />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <LogoutButton className="w-full justify-start" variant={"ghost"} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
