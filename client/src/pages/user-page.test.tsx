import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, afterEach, afterAll, vi } from "vitest";
import * as getUserByUsername from "@/services/get-user-by-username";
import * as isFriendService from "@/services/is-friend";
import friendsMockResponses from "@/__mocks__/api-responses/friends";
import usersMockResponses from "@/__mocks__/api-responses/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserPage from "./user-page";
import { Toaster } from "@/components/shadcn/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const routes = [
  {
    path: "/:username",
    element: <UserPage />,
  },
];

const username = usersMockResponses.getUserByUsername.success.data.username;
const router = createMemoryRouter(routes, {
  initialEntries: ["/" + username],
});

const renderUserPage = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
};

vi.spyOn(isFriendService, "default").mockResolvedValue(
  friendsMockResponses.isFriend.success.true.data
);

describe("User Page", () => {
  afterEach(() => {
    localStorage.clear();
    queryClient.getQueryCache().clear();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  it("should render the user page", async () => {
    const userData = usersMockResponses.getUserByUsername.success.data;
    vi.spyOn(getUserByUsername, "default").mockResolvedValue(userData);

    renderUserPage();

    await waitFor(async () => {
      expect(screen.getByText("@" + userData.username)).toBeInTheDocument();
    });
  });

  it("should render skeletons while loading", async () => {
    const userData = usersMockResponses.getUserByUsername.success.data;
    vi.spyOn(getUserByUsername, "default").mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(userData);
        }, 10000);
      });
    });

    renderUserPage();

    expect(screen.getByTestId("user-card-skeleton")).toBeInTheDocument();
  });

  it("should render error message and toast when error occurs", async () => {
    const userData = usersMockResponses.getUserByUsername.error.data;
    vi.spyOn(getUserByUsername, "default").mockImplementation(() => {
      // @ts-ignore
      return new Promise((resolve, reject) => {
        reject(userData);
      });
    });

    renderUserPage();

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument(); // Toast
      expect(screen.getByText("Error fetching user")).toBeInTheDocument();
    });
  });

  describe("User Options Dropdown", () => {
    it('should display "Remove Friend" in dropdown when isFriend is true', async () => {
      const userSetup = userEvent.setup();

      const userData = usersMockResponses.getUserByUsername.success.data;
      vi.spyOn(getUserByUsername, "default").mockResolvedValue(userData);

      renderUserPage();

      await waitFor(async () => {
        const button = screen.getByTestId("user-options-dropdown");
        await userSetup.click(button);
        expect(screen.getByText("Remove Friend")).toBeInTheDocument();
      });
    });

    it('should display "Add Friend" in dropdown when isFriend is false', async () => {
      const userSetup = userEvent.setup();

      const userData = usersMockResponses.getUserByUsername.success.data;
      vi.spyOn(getUserByUsername, "default").mockResolvedValue(userData);

      vi.spyOn(isFriendService, "default").mockResolvedValue(
        friendsMockResponses.isFriend.success.false.data
      );

      renderUserPage();

      await waitFor(async () => {
        const button = screen.getByTestId("user-options-dropdown");
        await userSetup.click(button);
        expect(screen.getByText("Add Friend")).toBeInTheDocument();
      });
    });

    // TODO: Add test to check for skeleton when loading
    it("should display skeleton when loading", async () => {
      const userSetup = userEvent.setup();

      const userData = usersMockResponses.getUserByUsername.success.data;
      vi.spyOn(getUserByUsername, "default").mockResolvedValue(userData);

      vi.spyOn(isFriendService, "default").mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(friendsMockResponses.isFriend.success.false.data);
          }, 10000);
        });
      });

      renderUserPage();

      await waitFor(async () => {
        const button = screen.getByTestId("user-options-dropdown");
        await userSetup.click(button);
        expect(
          screen.getByTestId("friend-status-skeleton")
        ).toBeInTheDocument();
      });
    });
  });
});
