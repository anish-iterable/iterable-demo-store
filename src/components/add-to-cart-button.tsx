"use client";

import { useCart } from "./cart-provider";

type Props = {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
  };
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() =>
        addToCart({
          product_id: product.id,
          name: product.name,
          slug: product.slug,
          unit_price: Number(product.price),
          quantity: 1,
        })
      }
      className="rounded-xl bg-black px-6 py-3 text-white"
    >
      Add to cart
    </button>
  );
}