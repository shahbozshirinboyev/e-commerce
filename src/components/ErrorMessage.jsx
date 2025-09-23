export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="p-3 rounded bg-red-100 text-red-800 border border-red-300" role="alert">
      {message}
    </div>
  );
}
