"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";
import { useToast } from "./toast-provider";

type Props = {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    image_url?: string | null;
  };
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      unit_price: Number(product.price),
      quantity: 1,
      image_url: product.image_url ?? null,
    });

    setAdded(true);
    showToast(`${product.name} added to cart`);

    setTimeout(() => {
      setAdded(false);
    }, 1200);
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`rounded-xl px-6 py-3 text-white transition ${
        added ? "bg-green-600" : "bg-black"
      }`}
    >
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}