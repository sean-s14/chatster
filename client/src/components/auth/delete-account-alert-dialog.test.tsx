import DeleteAccountAlertDialog from "./delete-account-alert-dialog";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/shadcn/ui/toaster";
import * as deleteAccountService from "@/services/auth/delete-account";
import * as logoutService from "@/services/auth/logout";
import * as refreshAccessTokenService from "@/services/auth/refresh-access-token";
import mockResponse from "@/__mocks__/mock-api-responses";
import { accessToken } from "@/__mocks__/mock-user-data";

describe("DeleteAccountAlertDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("Alert dialog opens on click", async () => {
    const userSetup = userEvent.setup();

    render(
      <BrowserRouter>
        <DeleteAccountAlertDialog />
        <Toaster />
      </BrowserRouter>
    );

    const button = screen.getByText("Delete Account");
    await userSetup.click(button);

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("Deletes account on click", async () => {
    vi.spyOn(refreshAccessTokenService, "default").mockResolvedValue(
      mockResponse.refreshAccessToken.success
    );

    vi.spyOn(deleteAccountService, "default").mockResolvedValue(
      mockResponse.deleteAccount.success
    );

    vi.spyOn(logoutService, "default").mockResolvedValue(
      mockResponse.logout.success
    );

    const userSetup = userEvent.setup();
    localStorage.setItem("accessToken", accessToken);

    render(
      <BrowserRouter>
        <DeleteAccountAlertDialog />
        <Toaster />
      </BrowserRouter>
    );

    const button = screen.getByText("Delete Account");
    await userSetup.click(button);
    expect(screen.getByText("Continue")).toBeInTheDocument();

    const continueButton = screen.getByText("Continue");
    await userSetup.click(continueButton);

    expect(deleteAccountService.default).toHaveBeenCalled();
    expect(logoutService.default).toHaveBeenCalled();

    const successToast = screen.getByText("Your account has been deleted");
    expect(successToast).toBeInTheDocument();
  });

  it("Displays error toast if user is not authenticated", async () => {
    vi.spyOn(refreshAccessTokenService, "default").mockRejectedValue(
      mockResponse.refreshAccessToken.unauthorized
    );

    const userSetup = userEvent.setup();

    render(
      <BrowserRouter>
        <DeleteAccountAlertDialog />
        <Toaster />
      </BrowserRouter>
    );

    const button = screen.getByText("Delete Account");
    await userSetup.click(button);
    expect(screen.getByText("Continue")).toBeInTheDocument();

    const continueButton = screen.getByText("Continue");
    await userSetup.click(continueButton);

    expect(deleteAccountService.default).not.toHaveBeenCalled();
    expect(logoutService.default).not.toHaveBeenCalled();

    const successToast = screen.getByText("You are not authenticated");
    expect(successToast).toBeInTheDocument();
  });

  it("Displays error toast if response status is error code", async () => {
    vi.spyOn(refreshAccessTokenService, "default").mockResolvedValue(
      mockResponse.refreshAccessToken.success
    );

    vi.spyOn(deleteAccountService, "default").mockRejectedValue(
      mockResponse.deleteAccount.serverError
    );

    const userSetup = userEvent.setup();
    localStorage.setItem("accessToken", accessToken);

    render(
      <BrowserRouter>
        <DeleteAccountAlertDialog />
        <Toaster />
      </BrowserRouter>
    );

    const button = screen.getByText("Delete Account");
    await userSetup.click(button);
    expect(screen.getByText("Continue")).toBeInTheDocument();

    const continueButton = screen.getByText("Continue");
    await userSetup.click(continueButton);

    expect(deleteAccountService.default).toHaveBeenCalled();
    expect(logoutService.default).not.toHaveBeenCalled();

    const errorToast = screen.getByText("Request failed");
    expect(errorToast).toBeInTheDocument();
  });
});
