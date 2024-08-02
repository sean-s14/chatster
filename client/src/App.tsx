import Navigation from "./components/navigation";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navigation />
      <h1 className="text-3xl font-bold underline text-center mt-4">
        Shadcn Setup Complete!
      </h1>
    </ThemeProvider>
  );
}

export default App;
