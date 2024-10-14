import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Profile from "./profile";
import { BrowserRouter } from "react-router-dom";
import { user, accessToken } from "@/__mocks__/mock-user-data";
import friendRequestMockResponses from "@/__mocks__/api-responses/friend-requests";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as getFriendRequestCount from "@/services/friend-request-count";

describe("Profile", () => {
  beforeAll(() => {
    localStorage.setItem("accessToken", accessToken);
  });

  afterAll(() => {
    localStorage.removeItem("accessToken");
  });

  it("Menu opens on click", async () => {
    const userSetup = userEvent.setup();

    vi.spyOn(getFriendRequestCount, "default").mockResolvedValue(
      friendRequestMockResponses.getFriendRequestCount.success.data
    );

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Profile user={user} />
        </BrowserRouter>
      </QueryClientProvider>
    );

    const button = screen.getByRole("button");
    await userSetup.click(button);

    expect(screen.getByText("@" + user.username)).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
    expect(screen.getByText("Friends")).toBeInTheDocument();
    expect(screen.getByText("Friend Requests")).toBeInTheDocument();
  });

  it("Friend request links and count displayed on hover", async () => {
    const userSetup = userEvent.setup();

    vi.spyOn(getFriendRequestCount, "default").mockResolvedValue(
      friendRequestMockResponses.getFriendRequestCount.success.data
    );

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Profile user={user} />
        </BrowserRouter>
      </QueryClientProvider>
    );

    const button = screen.getByRole("button");
    await userSetup.click(button);

    await waitFor(async () => {
      const friendRequests = screen.getByText("Friend Requests");
      await userSetup.hover(friendRequests);
      expect(screen.getByText("Sent")).toBeInTheDocument();
      expect(screen.getByTestId("sent-friend-request-count")).toHaveTextContent(
        "2"
      );
      expect(screen.getByText("Received")).toBeInTheDocument();
      expect(
        screen.getByTestId("received-friend-request-count")
      ).toHaveTextContent("1");
      expect(screen.getByText("All")).toBeInTheDocument();
      expect(
        screen.getByTestId("total-friend-request-count")
      ).toHaveTextContent("3");
    });
  });
});
