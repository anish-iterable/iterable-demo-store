import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold">Failed to load products</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="mt-2 text-gray-600">
          Simple demo catalogue for your storefront.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products?.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="rounded-2xl border border-gray-200 p-6 transition hover:shadow-sm"
            >
<div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
  {product.image_url ? (
    <Image
      src={product.image_url}
      alt={product.name}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  ) : null}
</div>
              <h2 className="mt-4 text-xl font-semibold">{product.name}</h2>
              <p className="mt-2 text-sm text-gray-600">{product.description}</p>
              <p className="mt-4 text-base font-medium">£{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}