import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider, useTheme } from "./theme-provider";

const mockMatchMedia = (matches: boolean) => {
  return {
    matches,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  };
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      "matchMedia",
      vi
        .fn()
        .mockImplementation((query) => mockMatchMedia(query.includes("dark")))
    );
  });

  it("provides the default theme", () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return <div>{theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText("system")).toBeInTheDocument();
  });

  it("provides a custom default theme", () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return <div>{theme}</div>;
    };

    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText("light")).toBeInTheDocument();
  });

  it("updates the theme and stores it in localStorage", () => {
    const TestComponent = () => {
      const { theme, setTheme } = useTheme();
      return (
        <div>
          <div>{theme}</div>
          <button onClick={() => setTheme("dark")}>Set Dark Theme</button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText("system")).toBeInTheDocument();

    act(() => {
      screen.getByText("Set Dark Theme").click();
    });

    expect(screen.getByText("dark")).toBeInTheDocument();
    expect(localStorage.getItem("vite-ui-theme")).toBe("dark");
  });

  it("reads the theme from localStorage on initial render", () => {
    localStorage.setItem("vite-ui-theme", "light");

    const TestComponent = () => {
      const { theme } = useTheme();
      return <div>{theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText("light")).toBeInTheDocument();
  });

  it("applies the correct class to the document element based on theme", () => {
    const root = window.document.documentElement;

    const TestComponent = () => {
      const { theme, setTheme } = useTheme();
      return (
        <div>
          <div>{theme}</div>
          <button onClick={() => setTheme("dark")}>Set Dark Theme</button>
          <button onClick={() => setTheme("light")}>Set Light Theme</button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText("Set Dark Theme").click();
    });

    expect(root.classList.contains("dark")).toBe(true);
    expect(root.classList.contains("light")).toBe(false);

    act(() => {
      screen.getByText("Set Light Theme").click();
    });

    expect(root.classList.contains("light")).toBe(true);
    expect(root.classList.contains("dark")).toBe(false);
  });
});
