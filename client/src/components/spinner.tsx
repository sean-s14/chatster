export default function Spinner({
  size = 20,
  borderSize = 2,
}: {
  size?: number;
  borderSize?: number;
}) {
  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="absolute top-0 left-0 border-slate-800 rounded-full"
        style={{
          width: size,
          height: size,
          borderWidth: borderSize,
          borderTopWidth: borderSize,
        }}
      ></div>
      <div
        className="absolute top-0 left-0 border-blue-400 border-t-transparent rounded-full animate-spin"
        style={{
          width: size,
          height: size,
          borderWidth: borderSize,
          borderTopWidth: borderSize,
        }}
      ></div>
    </div>
  );
}
