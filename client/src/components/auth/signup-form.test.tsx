import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/shadcn/ui/toaster";
import * as signupService from "@/services/signup";
import * as refreshAccessTokenService from "@/services/refresh-access-token";
import mockResponse from "@/__mocks__/mock-api-responses";
import { user, userPassword } from "@/__mocks__/mock-user-data";
import SignupForm from "@/components/auth/signup-form";

describe("Signup Form", () => {
  describe("Successful Signups", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(
        refreshAccessTokenService,
        "refreshAccessToken"
      ).mockRejectedValue(mockResponse.refreshAccessToken.unauthorized);
    });

    afterEach(() => {
      cleanup();
    });

    it("Signs a user up", async () => {
      const userSetup = userEvent.setup();

      vi.spyOn(signupService, "signup").mockResolvedValue(
        mockResponse.signup.success
      );

      render(
        <AuthProvider>
          <BrowserRouter>
            <SignupForm />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      );

      const emailInput = screen.getByLabelText("Email:");
      await userSetup.type(emailInput, user.email);

      const passwordInput = screen.getByLabelText("Password:");
      await userSetup.type(passwordInput, userPassword);

      const confirmPasswordInput = screen.getByLabelText("Confirm Password:");
      await userSetup.type(confirmPasswordInput, userPassword);

      const signupButton = screen.getByRole("button", { name: "Submit" });
      await userSetup.click(signupButton);

      expect(screen.queryByText("Signup Successful!")).toBeInTheDocument();

      expect(signupService.signup).toHaveBeenCalledTimes(1);
      expect(signupService.signup).toHaveBeenCalledWith({
        email: user.email,
        password: userPassword,
        password2: userPassword,
      });
    });
  });

  describe("Client Errors", () => {
    describe("Pre-submission validation", () => {
      beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(
          refreshAccessTokenService,
          "refreshAccessToken"
        ).mockRejectedValue(mockResponse.refreshAccessToken.unauthorized);
      });

      afterEach(() => {
        cleanup();
      });

      it("Displays error when email is invalid", async () => {
        const userSetup = userEvent.setup();

        render(
          <AuthProvider>
            <BrowserRouter>
              <SignupForm />
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        );

        const emailInput = screen.getByLabelText("Email:");
        await userSetup.type(emailInput, "invalid-email");

        expect(screen.queryByText("Email is invalid")).toBeInTheDocument();
        expect(signupService.signup).not.toHaveBeenCalled();
      });

      it("Displays error when passwords do not match", async () => {
        const userSetup = userEvent.setup();

        render(
          <AuthProvider>
            <BrowserRouter>
              <SignupForm />
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        );

        const passwordInput = screen.getByLabelText("Password:");
        await userSetup.type(passwordInput, "pass1234");

        const confirmPasswordInput = screen.getByLabelText("Confirm Password:");
        await userSetup.type(confirmPasswordInput, "pass12345");

        expect(
          screen.queryByText("Passwords do not match")
        ).toBeInTheDocument();
        expect(signupService.signup).not.toHaveBeenCalled();
      });
    });

    describe("Post-submission validation", () => {
      beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(
          refreshAccessTokenService,
          "refreshAccessToken"
        ).mockRejectedValue(mockResponse.refreshAccessToken.unauthorized);
      });

      afterEach(() => {
        cleanup();
      });

      it("Displays error when no email entered", async () => {
        const userSetup = userEvent.setup();

        render(
          <AuthProvider>
            <BrowserRouter>
              <SignupForm />
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        );

        const signupButton = screen.getByRole("button", { name: "Submit" });
        await userSetup.click(signupButton);

        expect(screen.queryByText("Email is required")).toBeInTheDocument();
        expect(signupService.signup).not.toHaveBeenCalled();
      });

      it("Displays error when no password entered", async () => {
        const userSetup = userEvent.setup();

        vi.spyOn(signupService, "signup").mockRejectedValue(
          mockResponse.signup.serverError
        );

        render(
          <AuthProvider>
            <BrowserRouter>
              <SignupForm />
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        );

        const emailInput = screen.getByLabelText("Email:");
        await userSetup.type(emailInput, user.email);

        const signupButton = screen.getByRole("button", { name: "Submit" });
        await userSetup.click(signupButton);

        expect(screen.queryByText("Password is required")).toBeInTheDocument();
        expect(signupService.signup).not.toHaveBeenCalled();
      });
    });
  });

  describe("Server Errors", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(
        refreshAccessTokenService,
        "refreshAccessToken"
      ).mockRejectedValue(mockResponse.refreshAccessToken.unauthorized);
    });

    afterEach(() => {
      cleanup();
    });

    it("Displays error toast when server error occurs", async () => {
      const userSetup = userEvent.setup();

      vi.spyOn(signupService, "signup").mockRejectedValue(
        mockResponse.signup.serverError
      );

      render(
        <AuthProvider>
          <BrowserRouter>
            <SignupForm />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      );

      const emailInput = screen.getByLabelText("Email:");
      await userSetup.type(emailInput, user.email);

      const passwordInput = screen.getByLabelText("Password:");
      await userSetup.type(passwordInput, userPassword);

      const confirmPasswordInput = screen.getByLabelText("Confirm Password:");
      await userSetup.type(confirmPasswordInput, userPassword);

      const signupButton = screen.getByRole("button", { name: "Submit" });
      await userSetup.click(signupButton);

      expect(screen.queryByText("Signup failed")).toBeInTheDocument();
      expect(screen.queryByText("Something went wrong")).toBeInTheDocument();

      expect(signupService.signup).toHaveBeenCalledTimes(1);
      expect(signupService.signup).toHaveBeenCalledWith({
        email: user.email,
        password: userPassword,
        password2: userPassword,
      });
    });

    it("Displays error when signing up with existing email", async () => {
      const userSetup = userEvent.setup();

      vi.spyOn(signupService, "signup").mockRejectedValue(
        mockResponse.signup.existingEmail
      );

      render(
        <AuthProvider>
          <BrowserRouter>
            <SignupForm />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      );

      const emailInput = screen.getByLabelText("Email:");
      await userSetup.type(emailInput, user.email);

      const passwordInput = screen.getByLabelText("Password:");
      await userSetup.type(passwordInput, userPassword);

      const confirmPasswordInput = screen.getByLabelText("Confirm Password:");
      await userSetup.type(confirmPasswordInput, userPassword);

      const signupButton = screen.getByRole("button", { name: "Submit" });
      await userSetup.click(signupButton);

      expect(screen.queryByText("Signup failed")).toBeInTheDocument();
      expect(
        screen.queryByText("User already exists with this email")
      ).toBeInTheDocument();

      expect(signupService.signup).toHaveBeenCalledTimes(1);
      expect(signupService.signup).toHaveBeenCalledWith({
        email: user.email,
        password: userPassword,
        password2: userPassword,
      });
    });

    it("Displays error when password is less than 8 characters", async () => {
      const userSetup = userEvent.setup();

      vi.spyOn(signupService, "signup").mockRejectedValue(
        mockResponse.signup.shortPassword
      );

      render(
        <AuthProvider>
          <BrowserRouter>
            <SignupForm />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      );

      const emailInput = screen.getByLabelText("Email:");
      await userSetup.type(emailInput, user.email);

      const shortPassword = "short";

      const passwordInput = screen.getByLabelText("Password:");
      await userSetup.type(passwordInput, shortPassword);

      const confirmPasswordInput = screen.getByLabelText("Confirm Password:");
      await userSetup.type(confirmPasswordInput, shortPassword);

      const signupButton = screen.getByRole("button", { name: "Submit" });
      await userSetup.click(signupButton);

      expect(
        screen.queryByText("Password must be at least 8 characters long")
      ).toBeInTheDocument();
      expect(signupService.signup).toHaveBeenCalledTimes(1);
      expect(signupService.signup).toHaveBeenCalledWith({
        email: user.email,
        password: shortPassword,
        password2: shortPassword,
      });
    });
  });
});
