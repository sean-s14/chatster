import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import routes from "@/pages/router-config";

describe("Router", () => {
  it("should render the home page", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);
    expect(screen.getByText("Welcome to Chatster!")).toBeInTheDocument();
  });

  it("should render the error page", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/non-existent-page"],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByText("Not Found")).toBeInTheDocument();
  });
});
