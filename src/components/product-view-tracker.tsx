"use client";

import { useEffect } from "react";
import { trackIterableEvent } from "@/lib/iterable-web";

type Props = {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
  };
};

export default function ProductViewTracker({ product }: Props) {
  useEffect(() => {
    trackIterableEvent("Product Viewed", {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      price: product.price,
    }).catch(console.error);
  }, [product]);

  return null;
}