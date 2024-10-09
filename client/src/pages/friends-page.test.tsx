import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, it, afterEach, afterAll, vi } from "vitest";
import routes from "@/pages/router-config";
import { accessToken } from "@/__mocks__/mock-user-data";
import * as getFriendList from "@/services/friend-list";
import friendsMockResponses from "@/__mocks__/api-responses/friends";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("Friends Page", () => {
  afterEach(() => {
    localStorage.clear();
    queryClient.getQueryCache().clear();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  it("should render the friends page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    localStorage.setItem("accessToken", accessToken);

    vi.spyOn(getFriendList, "default").mockResolvedValue(
      friendsMockResponses.getFriends.success.data
    );

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    act(() => {
      router.navigate("/friends");
    });

    await waitFor(() => {
      expect(screen.getByText("Friends")).toBeInTheDocument();
      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
  });

  it("should render skeletons when loading", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    localStorage.setItem("accessToken", accessToken);

    vi.spyOn(getFriendList, "default").mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(friendsMockResponses.getFriends.success.data);
        }, 10000);
      });
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    act(() => {
      router.navigate("/friends");
    });

    expect(screen.getByText("Friends")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(12);
  });

  it("should display error boundary when fetching friends fails", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    localStorage.setItem("accessToken", accessToken);

    vi.spyOn(getFriendList, "default").mockImplementation(() => {
      return Promise.reject({
        response: friendsMockResponses.getFriends.error.data,
      });
    });

    localStorage.setItem("accessToken", accessToken);

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    act(() => {
      router.navigate("/friends");
    });

    await waitFor(() => {
      expect(screen.getByText("Error fetching friends")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Try again" })
      ).toBeInTheDocument();
    });
  });
});
