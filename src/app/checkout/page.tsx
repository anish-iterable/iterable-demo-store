"use client";

import { useCart } from "@/components/cart-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong.");
      } else {
        clearCart();
        router.push(`/order-confirmation?orderId=${data.orderId}`);
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-gray-200 p-8">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="mt-2 text-gray-600">
            Simple demo checkout form. No payment integration yet.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-6 py-3 text-white disabled:opacity-60"
            >
              {loading ? "Placing order..." : "Place demo order"}
            </button>
          </form>

          {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
        </div>

        <aside className="rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>

          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × £{item.unit_price}
                  </p>
                </div>
                <p>£{(item.unit_price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">£{total.toFixed(2)}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}