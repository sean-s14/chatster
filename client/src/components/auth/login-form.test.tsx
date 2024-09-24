import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/shadcn/ui/toaster";
import * as loginService from "@/services/login";
import * as refreshAccessTokenService from "@/services/refresh-access-token";
import mockResponse from "@/__mocks__/mock-api-responses";
import { user, userPassword } from "@/__mocks__/mock-user-data";
import LoginForm from "@/components/auth/login-form";

describe("Login Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("Logs the user in", async () => {
    const userSetup = userEvent.setup();

    vi.spyOn(loginService, "login").mockResolvedValue(
      mockResponse.login.success
    );

    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginForm />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText("Email:");
    await userSetup.type(emailInput, user.email);

    const passwordInput = screen.getByLabelText("Password:");
    await userSetup.type(passwordInput, userPassword);

    const loginButton = screen.getByRole("button", { name: "Submit" });
    await userSetup.click(loginButton);

    expect(screen.queryByText("Login Successful!")).toBeInTheDocument();

    expect(loginService.login).toHaveBeenCalledTimes(1);
    expect(loginService.login).toHaveBeenCalledWith({
      email: user.email,
      password: userPassword,
    });
  });

  it("Displays error toast when server error occurs", async () => {
    const userSetup = userEvent.setup();

    vi.spyOn(refreshAccessTokenService, "refreshAccessToken").mockRejectedValue(
      mockResponse.refreshAccessToken.unauthorized
    );
    vi.spyOn(loginService, "login").mockRejectedValue(
      mockResponse.login.serverError
    );

    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginForm />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText("Email:");
    await userSetup.type(emailInput, user.email);

    const passwordInput = screen.getByLabelText("Password:");
    await userSetup.type(passwordInput, userPassword);

    const loginButton = screen.getByRole("button", { name: "Submit" });
    await userSetup.click(loginButton);

    expect(screen.queryByText("Login failed")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).toBeInTheDocument();

    expect(loginService.login).toHaveBeenCalledTimes(1);
    expect(loginService.login).toHaveBeenCalledWith({
      email: user.email,
      password: userPassword,
    });
  });

  it("Displays error when email is invalid", async () => {
    const userSetup = userEvent.setup();

    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginForm />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText("Email:");
    await userSetup.type(emailInput, "invalid-email");
    expect(screen.queryByText("Email is invalid")).toBeInTheDocument();
  });

  it("Displays error when password is incorrect", async () => {
    const userSetup = userEvent.setup();

    vi.spyOn(refreshAccessTokenService, "refreshAccessToken").mockRejectedValue(
      mockResponse.refreshAccessToken.unauthorized
    );
    vi.spyOn(loginService, "login").mockRejectedValue(
      mockResponse.login.incorrectPassword
    );

    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginForm />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText("Email:");
    await userSetup.type(emailInput, user.email);

    const passwordInput = screen.getByLabelText("Password:");
    await userSetup.type(passwordInput, "incorrect-password");

    const loginButton = screen.getByRole("button", { name: "Submit" });
    await userSetup.click(loginButton);

    expect(screen.queryByText("Incorrect password")).toBeInTheDocument();

    expect(loginService.login).toHaveBeenCalledTimes(1);
    expect(loginService.login).toHaveBeenCalledWith({
      email: user.email,
      password: "incorrect-password",
    });
  });

  it("Displays error when password is incorrect", async () => {
    const userSetup = userEvent.setup();

    vi.spyOn(refreshAccessTokenService, "refreshAccessToken").mockRejectedValue(
      mockResponse.refreshAccessToken.unauthorized
    );
    vi.spyOn(loginService, "login").mockRejectedValue(
      mockResponse.login.noUserWithThisEmail
    );

    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginForm />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    );

    const nonExistentEmail = "non-existent@email.com";

    const emailInput = screen.getByLabelText("Email:");
    await userSetup.type(emailInput, nonExistentEmail);

    const passwordInput = screen.getByLabelText("Password:");
    await userSetup.type(passwordInput, userPassword);

    const loginButton = screen.getByRole("button", { name: "Submit" });
    await userSetup.click(loginButton);

    expect(
      screen.queryByText("No user exists with this email")
    ).toBeInTheDocument();

    expect(loginService.login).toHaveBeenCalledTimes(1);
    expect(loginService.login).toHaveBeenCalledWith({
      email: nonExistentEmail,
      password: userPassword,
    });
  });
});
