import { ModeToggle } from "./mode-toggle";

export default function Navigation() {
  return (
    <nav className="h-16 px-6 flex justify-between items-center border-b-2">
      <h1 className="text-2xl font-bold">Chatster</h1>
      <ModeToggle />
    </nav>
  );
}
