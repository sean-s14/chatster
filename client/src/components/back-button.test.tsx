import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "@/pages/router-config";

describe("BackButton", () => {
  it("should not render the back button", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    expect(
      screen.queryByRole("button", { name: "Go Back" })
    ).not.toBeInTheDocument();
  });

  it("should render the back button", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    act(() => {
      router.navigate("/login");
    });

    expect(screen.getByRole("button", { name: "Go Back" })).toBeInTheDocument();
  });
});
