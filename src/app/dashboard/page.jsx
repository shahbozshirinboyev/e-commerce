export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded p-4">Total Sales</div>
        <div className="border rounded p-4">Orders</div>
        <div className="border rounded p-4">Products</div>
      </div>
    </div>
  );
}
