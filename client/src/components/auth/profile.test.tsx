import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Profile from "./profile";
import { BrowserRouter } from "react-router-dom";

describe("Profile", () => {
  it("Menu opens on click", async () => {
    const userSetup = userEvent.setup();

    const user = {
      name: "John Doe",
      picture: "../../../public/avatar.png",
    };

    render(
      <BrowserRouter>
        <Profile user={user} />
      </BrowserRouter>
    );

    const button = screen.getByRole("button");
    await userSetup.click(button);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });
});
