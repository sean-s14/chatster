import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Profile from "./profile";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";

describe("Profile", () => {
  it("Menu opens on click", async () => {
    const userSetup = userEvent.setup();

    const user = {
      id: 1,
      name: "John Doe",
      image: "../../../public/avatar.png",
      email: "john.doe@example.com",
      username: "johndoe",
      role: "BASIC",
    };

    render(
      <AuthProvider>
        <BrowserRouter>
          <Profile user={user} />
        </BrowserRouter>
      </AuthProvider>
    );

    const button = screen.getByRole("button");
    await userSetup.click(button);

    expect(screen.getByText(user.username)).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });
});
