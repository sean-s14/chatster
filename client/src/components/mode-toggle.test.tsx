import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ModeToggle } from "./mode-toggle";
import { ThemeProvider } from "./theme-provider";

const components = (
  <ThemeProvider>
    <ModeToggle />
  </ThemeProvider>
);

const mockMatchMedia = (matches: boolean) => {
  return {
    matches,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  };
};

describe("ModeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      "matchMedia",
      vi
        .fn()
        .mockImplementation((query) => mockMatchMedia(query.includes("dark")))
    );
  });

  it("menu opens on click", async () => {
    const user = userEvent.setup();
    render(components);
    const button = screen.getByRole("button");
    await user.click(button);

    const light = screen.getByText("Light");
    const dark = screen.getByText("Dark");
    const system = screen.getByText("System");
    expect(light).toBeInTheDocument();
    expect(dark).toBeInTheDocument();
    expect(system).toBeInTheDocument();
  });

  it("sets theme to light", async () => {
    const user = userEvent.setup();
    render(components);
    const button = screen.getByRole("button");
    await user.click(button);

    act(() => {
      screen.getByText("Light").click();
    });

    expect(localStorage.getItem("vite-ui-theme")).toBe("light");
  });

  it("sets theme to dark", async () => {
    const user = userEvent.setup();
    render(components);
    const button = screen.getByRole("button");
    await user.click(button);

    act(() => {
      screen.getByText("Dark").click();
    });
    expect(localStorage.getItem("vite-ui-theme")).toBe("dark");
  });

  it("sets theme to system", async () => {
    const user = userEvent.setup();
    render(components);
    const button = screen.getByRole("button");
    await user.click(button);

    act(() => {
      screen.getByText("System").click();
    });
    expect(localStorage.getItem("vite-ui-theme")).toBe("system");
  });
});
