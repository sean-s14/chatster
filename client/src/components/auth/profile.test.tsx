import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Profile from "./profile";
import { BrowserRouter } from "react-router-dom";
import { user, accessToken } from "@/__mocks__/mock-user-data";

describe("Profile", () => {
  beforeAll(() => {
    localStorage.setItem("accessToken", accessToken);
  });

  afterAll(() => {
    localStorage.removeItem("accessToken");
  });

  it("Menu opens on click", async () => {
    const userSetup = userEvent.setup();

    render(
      <BrowserRouter>
        <Profile user={user} />
      </BrowserRouter>
    );

    const button = screen.getByRole("button");
    await userSetup.click(button);

    expect(screen.getByText("@" + user.username)).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });
});
