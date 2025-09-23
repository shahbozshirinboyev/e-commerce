export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto p-6 text-center space-y-2">
      <h1 className="text-2xl font-semibold">404 – Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/" className="text-blue-600 underline">Go home</a>
    </div>
  );
}
