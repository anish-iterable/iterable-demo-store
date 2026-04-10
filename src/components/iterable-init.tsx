"use client";

import { useEffect } from "react";
import { initIterableWebSdk } from "@/lib/iterable-web";

export default function IterableInit() {
  useEffect(() => {
    initIterableWebSdk().catch(console.error);
  }, []);

  return null;
}