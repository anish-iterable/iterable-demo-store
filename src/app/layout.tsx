import "./globals.css";
import { CartProvider } from "@/components/cart-provider";

export const metadata = {
  title: "Iterable Demo Store",
  description: "Simple ecommerce demo for Iterable use cases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <CartProvider>
          <header className="border-b border-gray-200">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <a href="/" className="text-xl font-semibold tracking-tight">
                Iterable Demo Store
              </a>

              <nav className="flex items-center gap-6 text-sm text-gray-700">
                <a href="/products">Products</a>
                <a href="/signup">Newsletter</a>
                <a href="/cart">Cart</a>
                <a href="/checkout">Checkout</a>
              </nav>
            </div>
          </header>

          {children}
        </CartProvider>
      </body>
    </html>
  );
}