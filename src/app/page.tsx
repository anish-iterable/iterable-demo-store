export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Demo Ecommerce Store
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Clean ecommerce demo built for customer journeys and product events
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          A simple storefront to demo browse, cart, checkout, signup, and later
          Iterable integration.
        </p>

        <div className="mt-10 flex gap-4">
          <a
            href="/products"
            className="rounded-xl bg-black px-6 py-3 text-white transition hover:opacity-90"
          >
            Shop products
          </a>

          <a
            href="/signup"
            className="rounded-xl border border-gray-300 px-6 py-3 transition hover:bg-gray-50"
          >
            Join newsletter
          </a>
        </div>
      </section>
    </main>
  );
}