import DeleteAccountAlertDialog from "./delete-account-alert-dialog";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/shadcn/ui/toaster";
import * as deleteAccountService from "@/services/delete-account";
import * as logoutService from "@/services/logout";
import * as refreshAccessTokenService from "@/services/refresh-access-token";
import { AccessTokenPayload } from "@/context/auth-context";
import jwt from "jsonwebtoken";

function generateAccessToken(user: AccessTokenPayload) {
  return jwt.sign(user, "jwt_secret", { expiresIn: "15m" });
}

const user = {
  id: 1,
  name: "John Doe",
  image: "../../../public/avatar.png",
  email: "john.doe@example.com",
  username: "johndoe",
  role: "basic",
};

const accessToken = generateAccessToken(user);

const logoutMockResponse = {
  success: {
    status: 200,
    statusText: "OK",
    data: null,
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const refreshAccessTokenMockResponse = {
  success: accessToken,
  unauthorized: {
    status: 401,
    statusText: "Unauthorized",
    data: { error: "Unauthorized" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

const deleteAccountMockResponse = {
  success: {
    status: 204,
    statusText: "No Content",
    data: null,
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
  serverError: {
    status: 500,
    statusText: "Internal Server Error",
    data: { error: "Error deleting user" },
    headers: {
      "Content-Type": "application/json",
    },
    config: {} as any,
  },
};

describe("DeleteAccountAlertDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Alert dialog opens on click", async () => {
    const userSetup = userEvent.setup();

    render(
      <AuthProvider>
        <BrowserRouter>
          <DeleteAccountAlertDialog />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    );

    const button = screen.getByText("Delete Account");
    await userSetup.click(button);

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("Deletes account on click", async () => {
    vi.spyOn(refreshAccessTokenService, "refreshAccessToken").mockResolvedValue(
      refreshAccessTokenMockResponse.success
    );

    vi.spyOn(deleteAccountService, "deleteAccount").mockResolvedValue(
      deleteAccountMockResponse.success
    );

    vi.spyOn(logoutService, "logout").mockResolvedValue(
      logoutMockResponse.success
    );

    const userSetup = userEvent.setup();

    render(
      <AuthProvider>
        <BrowserRouter>
          <DeleteAccountAlertDialog />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    );

    const button = screen.getByText("Delete Account");
    await userSetup.click(button);
    expect(screen.getByText("Continue")).toBeInTheDocument();

    const continueButton = screen.getByText("Continue");
    await userSetup.click(continueButton);

    expect(deleteAccountService.deleteAccount).toHaveBeenCalled();
    expect(logoutService.logout).toHaveBeenCalled();

    const successToast = screen.getByText("Your account has been deleted");
    expect(successToast).toBeInTheDocument();
  });

  it("Displays error toast if user is not authenticated", async () => {
    vi.spyOn(refreshAccessTokenService, "refreshAccessToken").mockRejectedValue(
      refreshAccessTokenMockResponse.unauthorized
    );

    const userSetup = userEvent.setup();

    render(
      <AuthProvider>
        <BrowserRouter>
          <DeleteAccountAlertDialog />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    );

    const button = screen.getByText("Delete Account");
    await userSetup.click(button);
    expect(screen.getByText("Continue")).toBeInTheDocument();

    const continueButton = screen.getByText("Continue");
    await userSetup.click(continueButton);

    expect(deleteAccountService.deleteAccount).not.toHaveBeenCalled();
    expect(logoutService.logout).not.toHaveBeenCalled();

    const successToast = screen.getByText("You are not authenticated");
    expect(successToast).toBeInTheDocument();
  });

  it("Displays error toast if response status is error code", async () => {
    vi.spyOn(refreshAccessTokenService, "refreshAccessToken").mockResolvedValue(
      refreshAccessTokenMockResponse.success
    );

    vi.spyOn(deleteAccountService, "deleteAccount").mockRejectedValue(
      deleteAccountMockResponse.serverError
    );

    const userSetup = userEvent.setup();

    render(
      <AuthProvider>
        <BrowserRouter>
          <DeleteAccountAlertDialog />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    );

    const button = screen.getByText("Delete Account");
    await userSetup.click(button);
    expect(screen.getByText("Continue")).toBeInTheDocument();

    const continueButton = screen.getByText("Continue");
    await userSetup.click(continueButton);

    expect(deleteAccountService.deleteAccount).toHaveBeenCalled();
    expect(logoutService.logout).not.toHaveBeenCalled();

    const successToast = screen.getByText("Request failed");
    expect(successToast).toBeInTheDocument();
  });
});
