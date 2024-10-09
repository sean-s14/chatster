import { User } from "@/types/api/users";
import getUserByUsername from "@/services/get-user-by-username";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/shadcn/use-toast";
import { Button } from "@/components/shadcn/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/shadcn/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/shadcn/ui/card";
import { Link } from "react-router-dom";
import {
  SendHorizonalIcon,
  CircleEllipsisIcon,
  PlusIcon,
  MinusIcon,
  BanIcon,
  ShareIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/shadcn/ui/dropdown-menu";
import sendFriendRequest from "@/services/send-friend-request";
import removeFriendService from "@/services/remove-friend";
import isFriendService from "@/services/is-friend";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { useEffect } from "react";
import { log } from "@/utils/logging";

function FriendStatus({ user }: { user: User }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey = ["isFriend", user.id];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: () => isFriendService(user.username),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const removeFriendMutation = useMutation({
    mutationFn: removeFriendService,
    onSuccess: () => {
      toast({
        title: "Friend removed",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onError: (error) => {
      log.error("Error removing friend:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addFriendMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast({
        title: "Friend request sent",
        variant: "success",
      });
    },
    onError: (error) => {
      log.error("Error sending friend request:", error);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isError) {
      log.error("Error fetching friend status:", error);
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    }
  }, [isError, error]);

  if (isLoading)
    return (
      <div
        data-testid="friend-status-skeleton"
        className="p-1 pt-3 px-3 flex gap-2 items-center"
      >
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="w-[80%] h-5" />
      </div>
    );

  if (isError) {
    return <p>Error fetching friend status</p>;
  }

  if (data?.isFriend) {
    // TODO: Add popup for removing a friend
    return (
      <DropdownMenuItem className="p-0">
        <Button
          className="rounded-none w-full justify-start gap-2 p-0 py-1.5 px-3 h-fit"
          variant={"ghost"}
          onClick={() => removeFriendMutation.mutate(user.id)}
        >
          <MinusIcon className="w-4" />
          <span>Remove Friend</span>
        </Button>
      </DropdownMenuItem>
    );
  }

  // TODO: After sending a friend request replace the 'Add Friend' button with 'Cancel Request'
  return (
    <DropdownMenuItem className="p-0">
      <Button
        className="rounded-none w-full justify-start gap-2 p-0 py-1.5 px-3 h-fit"
        variant={"ghost"}
        onClick={() => addFriendMutation.mutate(user.id)}
      >
        <PlusIcon className="w-4" />
        <span>Add Friend</span>
      </Button>
    </DropdownMenuItem>
  );
}

function UserOptionsDropdown({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-testid="user-options-dropdown"
          variant="outline"
          className="w-10 p-1 rounded-lg"
        >
          <CircleEllipsisIcon className="w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-0">
        <FriendStatus user={user} />
        <DropdownMenuItem className="py-1.5 px-3 flex gap-2" disabled>
          <BanIcon className="w-4" />
          <span>Block &#40;Not implemented&#41;</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-1.5 px-3 flex gap-2" disabled>
          <ShareIcon className="w-4" />
          <span>Share Profile &#40;Not implemented&#41;</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// TODO: This should link to a private chat with the user
function ChatLink() {
  return (
    <Link to={"/"}>
      <Button className="flex items-center gap-2" variant={"outline"}>
        <span className="font-semibold text-base">Send a message</span>
        <SendHorizonalIcon className="w-4" />
      </Button>
    </Link>
  );
}

function UserCardSkeleton() {
  return (
    <div
      className="flex flex-col items-center"
      data-testid="user-card-skeleton"
    >
      <Card className="w-96 flex flex-col items-center p-4">
        <CardHeader className="flex flex-col items-center">
          <Skeleton className="w-24 h-24 rounded-full mb-4" />
          <Skeleton className="w-40 h-6 mb-4" />
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Skeleton className="w-44 h-8" />
          <Skeleton className="rounded-lg w-8 h-8" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function UserPage() {
  const { toast } = useToast();
  const { username } = useParams();
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUserByUsername(username!),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  useEffect(() => {
    if (isError) {
      log.error("Error fetching user:", error);
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    }
  }, [isError, error]);

  if (isLoading) return <UserCardSkeleton />;

  if (isError) {
    return <p>Error fetching user</p>;
  }

  if (!user) {
    return (
      <div className="flex justify-center text-lg">
        User "{username}" Not Found
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Card className="w-96 flex flex-col items-center p-4">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-24 h-24 rounded-full mb-4">
            <AvatarImage
              src={user?.image || "/profile-default.png"}
              className="w-24 h-24"
            />
            <AvatarFallback>
              <img src="/profile-picture.png" alt="Avatar" />
            </AvatarFallback>
          </Avatar>
          <p className="text-lg font-semibold mb-4">@{user.username}</p>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <ChatLink />
          <UserOptionsDropdown user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
