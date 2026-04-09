"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export default function CartPage() {
  const { items, total, removeFromCart } = useCart();

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
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center justify-between border-b border-gray-200 pb-4"
                  >
                    <div>
                      <h2 className="font-semibold">{item.name}</h2>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        £{item.unit_price * item.quantity}
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
                <p className="text-lg font-semibold">£{total}</p>
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