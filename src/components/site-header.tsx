"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { createClient } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";

type AuthUser = {
  email?: string;
};

export default function SiteHeader() {
  const { itemCount } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user ? { email: user.email } : null);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email } : null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    showToast("Logged out");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight text-gray-900"
        >
          Iterable Demo Store
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/products" className="transition hover:text-gray-900">
            Products
          </Link>

          <Link href="/signup" className="transition hover:text-gray-900">
            Newsletter
          </Link>

          {user ? (
            <>
              <Link href="/account" className="transition hover:text-gray-900">
                Account
              </Link>

              <button
                onClick={handleLogout}
                className="transition hover:text-gray-900"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="transition hover:text-gray-900">
                Login
              </Link>

              <Link href="/register" className="transition hover:text-gray-900">
                Create account
              </Link>
            </>
          )}

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          >
            <span>Cart</span>

            {itemCount > 0 && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-gray-900 px-1.5 py-0.5 text-xs text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}