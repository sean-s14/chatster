export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <div className="w-6 h-6 border-2 border-blue-400 border-transparent rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-6 h-6 border-2 border-blue-400 border-t-transparent border-t-2 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
