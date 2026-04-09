import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import SiteHeader from "@/components/site-header";
import { ToastProvider } from "@/components/toast-provider";

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
        <ToastProvider>
          <CartProvider>
            <SiteHeader />
            {children}
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}