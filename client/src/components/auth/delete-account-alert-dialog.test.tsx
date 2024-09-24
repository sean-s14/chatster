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
import mockResponse from "@/__mocks__/mock-api-responses";

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
      mockResponse.refreshAccessToken.success
    );

    vi.spyOn(deleteAccountService, "deleteAccount").mockResolvedValue(
      mockResponse.deleteAccount.success
    );

    vi.spyOn(logoutService, "logout").mockResolvedValue(
      mockResponse.logout.success
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
      mockResponse.refreshAccessToken.unauthorized
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
      mockResponse.refreshAccessToken.success
    );

    vi.spyOn(deleteAccountService, "deleteAccount").mockRejectedValue(
      mockResponse.deleteAccount.serverError
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

    const errorToast = screen.getByText("Request failed");
    expect(errorToast).toBeInTheDocument();
  });
});
