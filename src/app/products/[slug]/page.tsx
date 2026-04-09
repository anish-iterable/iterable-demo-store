import AddToCartButton from "@/components/add-to-cart-button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !product) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/products" className="mt-4 inline-block underline">
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-gray-100" />

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Demo product
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            {product.name}
          </h1>

          <p className="mt-4 text-lg text-gray-600">{product.description}</p>

          <p className="mt-6 text-2xl font-semibold">£{product.price}</p>

          <div className="mt-8 flex gap-4">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
              }}
            />

            <Link
              href="/checkout"
              className="rounded-xl border border-gray-300 px-6 py-3"
            >
              Buy now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}