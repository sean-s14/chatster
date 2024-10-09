import getFriendList from "@/services/friend-list";
import { useState, Suspense } from "react";
import { Friend } from "@/types/api/friends";
import { Link } from "react-router-dom";
import { Button } from "@/components/shadcn/ui/button";
import {
  useSuspenseQuery,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "@/components/shadcn/ui/skeleton";

function FriendCard({ friend }: { friend: Friend }) {
  return (
    <Link
      to={`/user/${friend.username}`}
      className="w-64 max-w-64 flex items-center gap-2 justify-center p-2 px-3 bg-slate-200 dark:bg-slate-700 rounded-lg"
    >
      <img
        src={friend.image || "/profile-picture.png"}
        alt={friend.username}
        className="w-10 h-10 rounded-full"
      />
      <h2 className="text-base font-semibold truncate w-full">
        @{friend.username}
      </h2>
    </Link>
  );
}

function FriendCardSkeleton() {
  return (
    <Skeleton className="w-64 max-w-64 flex items-center gap-2 justify-start p-2 px-3 bg-slate-200 dark:bg-slate-700 rounded-lg">
      <Skeleton className="w-10 h-10 rounded-full bg-slate-400 animate-pulse"></Skeleton>
      <Skeleton className="w-[80%] h-4 bg-slate-400 animate-pulse"></Skeleton>
    </Skeleton>
  );
}

const friendLimit = 12;

function FriendsPageContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useSuspenseQuery({
    queryKey: ["friends", currentPage],
    queryFn: () => getFriendList({ page: currentPage, limit: friendLimit }),
  });

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data) {
      if (currentPage < data.pagination.totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  return (
    <>
      <div className="mb-4 text-muted-foreground">
        Showing {data?.friends.length} of {data?.pagination.totalItems} friends
      </div>
      <ul
        role="list"
        className="flex gap-3 flex-wrap justify-center max-w-[80%]"
      >
        {data?.friends.map((friend) => (
          <li role="listitem" key={friend.id}>
            <FriendCard friend={friend} />
          </li>
        ))}
      </ul>
      <div className="mt-5 flex gap-3 items-center">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {data?.pagination.totalPages}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === data?.pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </>
  );
}

function FriendsPageContentSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Skeleton className="w-44 h-3 animate-pulse bg-slate-400" />
      <ul className="flex gap-3 flex-wrap justify-center max-w-[80%]">
        {Array.from({ length: friendLimit }).map((_, index) => (
          <li key={index}>
            <FriendCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

// TODO: Add search bar to search through friends
export default function FriendsPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold mb-6">Friends</h1>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => {
              return (
                <div className="flex flex-col items-center justify-center">
                  <p className="mb-2">Error fetching friends</p>
                  <Button onClick={resetErrorBoundary} variant={"outline"}>
                    Try again
                  </Button>
                </div>
              );
            }}
          >
            <Suspense fallback={<FriendsPageContentSkeleton />}>
              <FriendsPageContent />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}
