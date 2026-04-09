import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 p-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Order not found
          </h1>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-xl bg-black px-6 py-3 text-white"
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", Number(orderId))
    .single();

  const { data: orderItems } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      unit_price,
      products (
        name,
        image_url
      )
    `)
    .eq("order_id", Number(orderId));

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 p-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Order complete
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Thank you for your order
          </h1>
          <p className="mt-4 text-gray-600">
            Your demo purchase has been recorded successfully.
          </p>
          <p className="mt-4 text-sm text-gray-500">Order ID: {orderId}</p>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold">Purchased items</h2>

          <div className="mt-4 space-y-4">
            {orderItems?.map((item) => {
              const product = Array.isArray(item.products)
                ? item.products[0]
                : item.products;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-center gap-4">
<div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
  {product?.image_url ? (
    <Image
      src={product.image_url}
      alt={product.name}
      fill
      className="object-cover"
      sizes="80px"
    />
  ) : null}
</div>

                    <div>
                      <p className="font-medium">{product?.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-medium">
                    £{(item.unit_price * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">
              £{Number(order?.total_amount ?? 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-block rounded-xl bg-black px-6 py-3 text-white"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}