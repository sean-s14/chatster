import { BrowserRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, afterEach, afterAll, vi } from "vitest";
import { accessToken } from "@/__mocks__/mock-user-data";
import * as getFriendRequests from "@/services/friend-request-list";
import friendRequestsMockResponses from "@/__mocks__/api-responses/friend-requests";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FriendRequestsPage from "./friend-requests";
import { Toaster } from "@/components/shadcn/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderFriendRequestPage = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FriendRequestsPage />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );

describe("Friend Requests Page", () => {
  beforeEach(() => {
    localStorage.setItem("accessToken", accessToken);
  });

  afterEach(() => {
    localStorage.clear();
    queryClient.getQueryCache().clear();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  it("should render the friend requests page", async () => {
    vi.spyOn(getFriendRequests, "default").mockResolvedValue(
      friendRequestsMockResponses.getFriendRequests.success.data
    );

    renderFriendRequestPage();

    expect(screen.getByText("Friend Requests")).toBeInTheDocument();
  });

  describe("Success States", () => {
    it("should display all pending friend requests", async () => {
      vi.spyOn(getFriendRequests, "default").mockResolvedValue(
        friendRequestsMockResponses.getFriendRequests.success.data
      );

      renderFriendRequestPage();

      await waitFor(() => {
        expect(screen.getByTestId("friend-request-list")).toBeInTheDocument();
        expect(screen.getAllByTestId("friend-request-item")).toHaveLength(2);
      });
    });

    it("should display all pending friend requests sent", async () => {
      const userSetup = userEvent.setup();

      vi.spyOn(getFriendRequests, "default").mockResolvedValue(
        friendRequestsMockResponses.getFriendRequests.success.data
      );

      renderFriendRequestPage();

      const sentFriendRequestsTab = screen.getByRole("tab", { name: "Sent" });
      await userSetup.click(sentFriendRequestsTab);

      expect(screen.getByTestId("friend-request-list")).toBeInTheDocument();
      expect(screen.getAllByTestId("friend-request-item")).toHaveLength(2);
    });

    it("should display all pending friend requests received", async () => {
      const userSetup = userEvent.setup();

      vi.spyOn(getFriendRequests, "default").mockResolvedValue(
        friendRequestsMockResponses.getFriendRequests.success.data
      );

      renderFriendRequestPage();

      const receivedFriendRequestsTab = screen.getByRole("tab", {
        name: "Received",
      });
      await userSetup.click(receivedFriendRequestsTab);

      expect(screen.getByTestId("friend-request-list")).toBeInTheDocument();
      expect(screen.getAllByTestId("friend-request-item")).toHaveLength(2);
    });
  });

  describe("Loading/Error States", () => {
    it("should display skeleton when loading friend requests", async () => {
      vi.spyOn(getFriendRequests, "default").mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(
                friendRequestsMockResponses.getFriendRequests.success.data
              );
            }, 1000);
          })
      );

      renderFriendRequestPage();

      expect(
        screen.getByTestId("friend-request-content-skeleton")
      ).toBeInTheDocument();
    });

    it("should display 'Error fetching friend requests' when requests fails", async () => {
      vi.spyOn(getFriendRequests, "default").mockImplementation(
        () =>
          // @ts-ignore
          new Promise((resolve, reject) => {
            reject(friendRequestsMockResponses.getFriendRequests.error.data);
          })
      );

      renderFriendRequestPage();

      await waitFor(() => {
        expect(
          screen.getByText("Error fetching friend requests")
        ).toBeInTheDocument();
      });
    });

    it("should display 'No Friend Requests' when there are no friend requests", async () => {
      vi.spyOn(getFriendRequests, "default").mockResolvedValue({
        friendRequests: [],
        pagination: {
          totalPages: 1,
          currentPage: 1,
          totalItems: 0,
          itemsPerPage: 10,
        },
      });

      renderFriendRequestPage();

      await waitFor(() => {
        expect(screen.getByText("No Friend Requests")).toBeInTheDocument();
      });
    });
  });

  describe("Pagination", () => {
    describe("One Page", () => {
      it("should display correct pagination text and button states", async () => {
        vi.spyOn(getFriendRequests, "default").mockResolvedValue(
          friendRequestsMockResponses.getFriendRequests.success.data
        );

        renderFriendRequestPage();

        await waitFor(() => {
          const previousButton = screen.getByRole("button", {
            name: "Previous",
          });
          expect(previousButton).toBeDisabled();
          const nextButton = screen.getByRole("button", { name: "Next" });
          expect(nextButton).toBeDisabled();
          expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
        });
      });
    });

    describe("Two Pages", () => {
      it("should display button with the text 'Previous' that is disabled", async () => {
        vi.spyOn(getFriendRequests, "default").mockResolvedValue({
          friendRequests:
            friendRequestsMockResponses.getTenFriendRequests.success.data
              .friendRequests,
          pagination: {
            totalPages: 2,
            currentPage: 1,
            totalItems: 20,
            itemsPerPage: 10,
          },
        });

        renderFriendRequestPage();

        await waitFor(() => {
          expect(screen.getByTestId("friend-request-list")).toBeInTheDocument();
          expect(screen.getAllByTestId("friend-request-item")).toHaveLength(10);

          const previousButton = screen.getByRole("button", {
            name: "Previous",
          });
          expect(previousButton).toBeDisabled();
          const nextButton = screen.getByRole("button", { name: "Next" });
          expect(nextButton).not.toBeDisabled();
          expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
        });
      });

      it("should display second page of friend requests after clicking the 'Next' button", async () => {
        const userSetup = userEvent.setup();
        vi.spyOn(getFriendRequests, "default").mockResolvedValueOnce(
          friendRequestsMockResponses.getTenFriendRequests.success.data
        );

        renderFriendRequestPage();

        await waitFor(async () => {
          expect(screen.getByTestId("friend-request-list")).toBeInTheDocument();
          expect(screen.getAllByTestId("friend-request-item")).toHaveLength(10);
          expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
        });

        const nextButton = screen.getByRole("button", { name: "Next" });
        const previousButton = screen.getByRole("button", {
          name: "Previous",
        });

        vi.spyOn(getFriendRequests, "default").mockResolvedValue({
          friendRequests:
            friendRequestsMockResponses.getFriendRequests.success.data
              .friendRequests,
          pagination: {
            totalPages: 2,
            currentPage: 2,
            totalItems: 12,
            itemsPerPage: 10,
          },
        });

        await waitFor(async () => {
          expect(previousButton).toBeDisabled();
          expect(nextButton).not.toBeDisabled();

          await userSetup.click(nextButton);

          expect(screen.getByTestId("friend-request-list")).toBeInTheDocument();
          expect(screen.getAllByTestId("friend-request-item")).toHaveLength(2);

          {
            const previousButton = screen.getByRole("button", {
              name: "Previous",
            });
            const nextButton = screen.getByRole("button", { name: "Next" });
            expect(previousButton).not.toBeDisabled();
            expect(nextButton).toBeDisabled();
          }
        });
      });
    });
  });

  // TODO: Add tests for cancelling friend requests (success, loading, error)
  // TODO: Add tests for accepting friend requests (success, loading, error)
  // TODO: Add tests for rejecting friend requests (success, loading, error)
});
