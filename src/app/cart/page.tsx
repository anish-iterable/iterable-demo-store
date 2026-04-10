"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { useEffect } from "react";
import { trackIterableEvent } from "@/lib/iterable-web";

export default function CartPage() {
  const { items, total, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    if (items.length > 0) {
      trackIterableEvent("Cart Viewed", {
        itemCount: items.length,
        total,
        items: items.map((item) => ({
          productId: item.product_id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
        })),
      }).catch(console.error);
    }
  }, [items, total]);

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>

        <div className="mt-8 rounded-2xl border border-gray-200 p-6">
          {items.length === 0 ? (
            <div>
              <p className="text-gray-600">Your cart is empty.</p>
              <Link
                href="/products"
                className="mt-4 inline-block rounded-xl bg-black px-6 py-3 text-white"
              >
                Shop products
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center justify-between border-b border-gray-200 pb-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : null}
                      </div>

                      <div>
                        <h2 className="font-semibold">{item.name}</h2>
                        <p className="text-sm text-gray-600">
                          £{item.unit_price} each
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity - 1)
                            }
                            className="h-8 w-8 rounded-full border border-gray-300"
                          >
                            -
                          </button>

                          <span className="min-w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity + 1)
                            }
                            className="h-8 w-8 rounded-full border border-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        £{(item.unit_price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="mt-2 text-sm text-gray-500 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-lg font-semibold">£{total.toFixed(2)}</p>
              </div>

              <Link
                href="/checkout"
                className="mt-6 inline-block rounded-xl bg-black px-6 py-3 text-white"
              >
                Continue to checkout
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}