import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/ui/tabs";
import { Button } from "@/components/shadcn/ui/button";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getFriendRequests from "@/services/friend-request-list";
import cancelFriendRequest from "@/services/cancel-friend-request";
import acceptFriendRequest from "@/services/accept-friend-request";
import rejectFriendRequest from "@/services/reject-friend-request";
import {
  FriendRequestTypeEnum as FRTypeEnum,
  FriendRequestStatusEnum,
} from "@/types/api/friend-request-enums";
import type {
  FriendRequestType,
  FriendRequestStatusType,
  FriendRequestDetails as IFriendRequestDetails,
} from "@/types/api/friend-requests.d";
import decodeAccessToken from "@/utils/auth/decode-access-token";
import { log } from "@/utils/logging";
import capitalise from "@/utils/capitalise";
import { useToast } from "@/hooks/shadcn/use-toast";

interface IFriendRequest {
  requestType: FriendRequestType;
}

function FriendRequestContentSkeleton() {
  return (
    <Card
      className="p-3 rounded-lg "
      data-testid="friend-request-content-skeleton"
    >
      <CardHeader>
        {/* Request Type */}
        <Skeleton className="h-6 w-40 rounded" />
        {/* Description */}
        <Skeleton className="h-4 w-60 rounded" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Card className="flex flex-col gap-4 rounded-lg p-2">
          {/* Date and Request Message */}
          <div className="flex flex-col gap-2 items-center">
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton className="h-3 w-60 rounded" />
          </div>
          <div className="grid grid-cols-2">
            {/* Profile Picture and Username */}
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
            {/* Cancel, Accept, and Reject Buttons */}
            <div className="flex items-center justify-center">
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        </Card>
      </CardContent>
      {/* Pagination */}
      <CardFooter className="flex justify-center gap-4">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </CardFooter>
    </Card>
  );
}

function FriendRequestsCard({
  requestType,
}: {
  requestType: FriendRequestType;
}) {
  const [status] = useState<FriendRequestStatusType>(
    FriendRequestStatusEnum.PENDING
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["friendRequests", requestType, status, page, limit],
    queryFn: () =>
      getFriendRequests({ type: requestType, status, page, limit }),
  });

  if (isLoading) {
    return <FriendRequestContentSkeleton />;
  }

  if (isError) {
    log.error("Error Message:", error?.message);
    return (
      <Card className="p-4 text-center">Error fetching friend requests</Card>
    );
  }

  if (!data?.friendRequests || data.friendRequests.length === 0) {
    return <Card className="p-4 text-center">No Friend Requests</Card>;
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data) {
      if (page < data.pagination.totalPages) {
        setPage((prev) => prev + 1);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {capitalise(requestType.toLowerCase())} Friend Requests
        </CardTitle>
        <CardDescription>
          {data?.pagination.totalItems} {status.toLowerCase()} friend requests
        </CardDescription>
        {/* TODO: Add select component to change status */}
      </CardHeader>
      <CardContent className="space-y-2">
        <ul className="flex flex-col gap-4" data-testid="friend-request-list">
          {data.friendRequests.map((request: any) => (
            <li key={request.id} data-testid="friend-request-item">
              <FriendRequestDetails request={request} />
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-center">
        <FriendRequestPagination
          page={page}
          totalPages={data?.pagination.totalPages || 1}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
        />
      </CardFooter>
    </Card>
  );
}

function FriendRequestDetails({ request }: { request: IFriendRequestDetails }) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const cancelFriendRequestMutation = useMutation({
    mutationFn: (requestId: number) => cancelFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "friendRequests",
          FRTypeEnum.ALL,
          FriendRequestStatusEnum.PENDING,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "friendRequests",
          FRTypeEnum.SENT,
          FriendRequestStatusEnum.PENDING,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["friendRequestCount"],
      });
    },
    onError: (error: any) => {
      log.error(error);
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: error?.message,
      });
    },
  });

  const acceptFriendRequestMutation = useMutation({
    mutationFn: (requestId: number) => acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "friendRequests",
          FRTypeEnum.ALL,
          FriendRequestStatusEnum.PENDING,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "friendRequests",
          FRTypeEnum.RECEIVED,
          FriendRequestStatusEnum.PENDING,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["friendRequestCount"],
      });
    },
    onError: (error: any) => {
      log.error(error);
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: error?.message,
      });
    },
  });

  const rejectFriendRequestMutation = useMutation({
    mutationFn: (requestId: number) => rejectFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "friendRequests",
          FRTypeEnum.ALL,
          FriendRequestStatusEnum.PENDING,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "friendRequests",
          FRTypeEnum.RECEIVED,
          FriendRequestStatusEnum.PENDING,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["friendRequestCount"],
      });
    },
    onError: (error: any) => {
      log.error(error);
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: error?.message,
      });
    },
  });

  const user = decodeAccessToken();
  const sentByUser = user?.id === request.senderId;

  let message = "";
  if (sentByUser) {
    message = "You sent a friend request to " + request.receiver.username;
  } else {
    message = request.sender.username + " sent you a friend request";
  }

  const handleCancelFriendRequest = () => {
    cancelFriendRequestMutation.mutate(request.id);
  };

  const handleAcceptFriendRequest = () => {
    acceptFriendRequestMutation.mutate(request.id);
  };

  const handleRejectFriendRequest = () => {
    rejectFriendRequestMutation.mutate(request.id);
  };

  return (
    <Card className="p-3 rounded-lg">
      <div className="text-xs text-muted-foreground mb-2 text-center">
        {new Date(request.createdAt).toLocaleDateString()}
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-center">{message}</div>
        <div className="gap-2 items-center grid grid-cols-2">
          <div className="flex flex-col items-center gap-2">
            <img
              src={request[sentByUser ? "receiver" : "sender"].image}
              alt="Senders Image"
              className="w-16 h-16 rounded-full"
            />
            <span className="text-blue-400">
              @{request[sentByUser ? "receiver" : "sender"].username}
            </span>
          </div>
          <div className="flex items-center justify-center">
            {sentByUser ? (
              <Button
                variant={"outline"}
                onClick={handleCancelFriendRequest}
                disabled={cancelFriendRequestMutation.isPending}
              >
                cancel
              </Button>
            ) : (
              <div className="flex gap-4">
                <Button
                  variant={"secondary"}
                  onClick={handleAcceptFriendRequest}
                  disabled={
                    acceptFriendRequestMutation.isPending ||
                    rejectFriendRequestMutation.isPending
                  }
                >
                  accept
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={handleRejectFriendRequest}
                  disabled={
                    rejectFriendRequestMutation.isPending ||
                    acceptFriendRequestMutation.isPending
                  }
                >
                  reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function FriendRequestPagination({
  page,
  totalPages,
  handlePrevPage,
  handleNextPage,
}: {
  page: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}) {
  return (
    <div className="mt-5 flex gap-3 items-center">
      <Button
        onClick={handlePrevPage}
        disabled={page === 1}
        variant={"outline"}
      >
        Previous
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button
        onClick={handleNextPage}
        disabled={page === totalPages}
        variant={"outline"}
      >
        Next
      </Button>
    </div>
  );
}

function FriendRequestTabs() {
  const { state }: { state: IFriendRequest } = useLocation();

  return (
    <Tabs
      defaultValue={state?.requestType || FRTypeEnum.ALL}
      className="w-[500px]"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value={FRTypeEnum.ALL}>All</TabsTrigger>
        <TabsTrigger value={FRTypeEnum.SENT}>Sent</TabsTrigger>
        <TabsTrigger value={FRTypeEnum.RECEIVED}>Received</TabsTrigger>
      </TabsList>
      <TabsContent value={FRTypeEnum.ALL}>
        <FriendRequestsCard requestType={FRTypeEnum.ALL} />
      </TabsContent>
      <TabsContent value={FRTypeEnum.SENT}>
        <FriendRequestsCard requestType={FRTypeEnum.SENT} />
      </TabsContent>
      <TabsContent value={FRTypeEnum.RECEIVED}>
        <FriendRequestsCard requestType={FRTypeEnum.RECEIVED} />
      </TabsContent>
    </Tabs>
  );
}

export default function FriendRequestsPage() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 pb-10">
      <h1>Friend Requests</h1>
      <FriendRequestTabs />
    </div>
  );
}
