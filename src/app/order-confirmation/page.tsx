export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Order complete
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Thank you for your order
        </h1>

        <p className="mt-4 text-gray-600">
          Your demo purchase has been recorded successfully.
        </p>

        {orderId && (
          <p className="mt-4 text-sm text-gray-500">Order ID: {orderId}</p>
        )}

        <a
          href="/products"
          className="mt-8 inline-block rounded-xl bg-black px-6 py-3 text-white"
        >
          Continue shopping
        </a>
      </div>
    </main>
  );
}