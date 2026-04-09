"use client";

import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { useToast } from "./toast-provider";

export default function LogoutButton() {
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    showToast("Logged out");
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl bg-black px-6 py-3 text-white"
    >
      Log out
    </button>
  );
}