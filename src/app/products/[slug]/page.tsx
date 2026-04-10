import AddToCartButton from "@/components/add-to-cart-button";
import ProductViewTracker from "@/components/product-view-tracker";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
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
      <ProductViewTracker
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : null}
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Demo product
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            {product.name}
          </h1>

          <p className="mt-4 text-lg text-gray-600">{product.description}</p>

          <p className="mt-6 text-2xl font-semibold">
            £{Number(product.price).toFixed(2)}
          </p>

          <div className="mt-8 flex gap-4">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                image_url: product.image_url,
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