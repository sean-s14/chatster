import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, afterEach, afterAll, vi } from "vitest";
import { accessToken } from "@/__mocks__/mock-user-data";
import * as getFriendList from "@/services/friend-list";
import friendsMockResponses from "@/__mocks__/api-responses/friends";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FriendsPage from "./friends-page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const routes = [
  {
    path: "/",
    element: <FriendsPage />,
  },
];

const router = createMemoryRouter(routes, {
  initialEntries: ["/"],
});

const renderApp = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

describe("Friends Page", () => {
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

  it("should render the friends page", async () => {
    vi.spyOn(getFriendList, "default").mockResolvedValue(
      friendsMockResponses.getFriends.success.data
    );

    renderApp();

    await waitFor(() => {
      expect(screen.getByText("Friends")).toBeInTheDocument();
      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
  });

  it("should render skeletons when loading", () => {
    vi.spyOn(getFriendList, "default").mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(friendsMockResponses.getFriends.success.data);
        }, 2000);
      });
    });

    renderApp();

    expect(screen.getByText("Friends")).toBeInTheDocument();
    expect(
      screen.getByTestId("friends-page-content-skeleton")
    ).toBeInTheDocument();
  });

  it("should display error boundary when fetching friends fails", async () => {
    vi.spyOn(getFriendList, "default").mockImplementation(() => {
      return Promise.reject({
        response: friendsMockResponses.getFriends.error.data,
      });
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText("Error fetching friends")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Try again" })
      ).toBeInTheDocument();
    });
  });
});
