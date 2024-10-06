import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/shadcn/ui/toaster";
import * as loginService from "@/services/auth/login";
import * as refreshAccessTokenService from "@/services/auth/refresh-access-token";
import mockResponse from "@/__mocks__/mock-api-responses";
import { user, userPassword } from "@/__mocks__/mock-user-data";
import LoginForm from "@/components/auth/login-form";

describe("Login Form", () => {
  describe("Successful logins", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      cleanup();
    });

    it("Logs the user in", async () => {
      const userSetup = userEvent.setup();

      vi.spyOn(loginService, "default").mockResolvedValue(
        mockResponse.login.success
      );

      render(
        <BrowserRouter>
          <LoginForm />
          <Toaster />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText("Email:");
      await userSetup.type(emailInput, user.email);

      const passwordInput = screen.getByLabelText("Password:");
      await userSetup.type(passwordInput, userPassword);

      const loginButton = screen.getByRole("button", { name: "Submit" });
      await userSetup.click(loginButton);

      expect(screen.queryByText("Login Successful!")).toBeInTheDocument();

      expect(loginService.default).toHaveBeenCalledTimes(1);
      expect(loginService.default).toHaveBeenCalledWith({
        email: user.email,
        password: userPassword,
      });
    });
  });

  describe("Client Errors", () => {
    describe("Pre-submission validation", () => {
      beforeEach(() => {
        vi.clearAllMocks();
      });

      afterEach(() => {
        cleanup();
      });

      it("Displays error when email is invalid", async () => {
        const userSetup = userEvent.setup();

        render(
          <BrowserRouter>
            <LoginForm />
            <Toaster />
          </BrowserRouter>
        );

        const emailInput = screen.getByLabelText("Email:");
        await userSetup.type(emailInput, "invalid-email");
        expect(screen.queryByText("Email is invalid")).toBeInTheDocument();
      });

      it("Displays error when password is incorrect", async () => {
        const userSetup = userEvent.setup();

        vi.spyOn(refreshAccessTokenService, "default").mockRejectedValue(
          mockResponse.refreshAccessToken.unauthorized
        );
        vi.spyOn(loginService, "default").mockRejectedValue(
          mockResponse.login.incorrectPassword
        );

        render(
          <BrowserRouter>
            <LoginForm />
            <Toaster />
          </BrowserRouter>
        );

        const emailInput = screen.getByLabelText("Email:");
        await userSetup.type(emailInput, user.email);

        const passwordInput = screen.getByLabelText("Password:");
        await userSetup.type(passwordInput, "incorrect-password");

        const loginButton = screen.getByRole("button", { name: "Submit" });
        await userSetup.click(loginButton);

        expect(screen.queryByText("Incorrect password")).toBeInTheDocument();

        expect(loginService.default).toHaveBeenCalledTimes(1);
        expect(loginService.default).toHaveBeenCalledWith({
          email: user.email,
          password: "incorrect-password",
        });
      });
    });

    describe("Post-submission validation", () => {
      beforeEach(() => {
        vi.clearAllMocks();
      });

      afterEach(() => {
        cleanup();
      });

      it("Displays error when no user exists with specified email", async () => {
        const userSetup = userEvent.setup();

        vi.spyOn(refreshAccessTokenService, "default").mockRejectedValue(
          mockResponse.refreshAccessToken.unauthorized
        );
        vi.spyOn(loginService, "default").mockRejectedValue(
          mockResponse.login.noUserWithThisEmail
        );

        render(
          <BrowserRouter>
            <LoginForm />
            <Toaster />
          </BrowserRouter>
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

        expect(loginService.default).toHaveBeenCalledTimes(1);
        expect(loginService.default).toHaveBeenCalledWith({
          email: nonExistentEmail,
          password: userPassword,
        });
      });
    });
  });

  describe("Server Errors", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      cleanup();
    });

    it("Displays error toast when server error occurs", async () => {
      const userSetup = userEvent.setup();

      vi.spyOn(refreshAccessTokenService, "default").mockRejectedValue(
        mockResponse.refreshAccessToken.unauthorized
      );
      vi.spyOn(loginService, "default").mockRejectedValue(
        mockResponse.login.serverError
      );

      render(
        <BrowserRouter>
          <LoginForm />
          <Toaster />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText("Email:");
      await userSetup.type(emailInput, user.email);

      const passwordInput = screen.getByLabelText("Password:");
      await userSetup.type(passwordInput, userPassword);

      const loginButton = screen.getByRole("button", { name: "Submit" });
      await userSetup.click(loginButton);

      expect(screen.queryByText("Login failed")).toBeInTheDocument();
      expect(screen.queryByText("Something went wrong")).toBeInTheDocument();

      expect(loginService.default).toHaveBeenCalledTimes(1);
      expect(loginService.default).toHaveBeenCalledWith({
        email: user.email,
        password: userPassword,
      });
    });
  });
});
