import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/logout-button";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold tracking-tight">My account</h1>

        <div className="mt-6 space-y-2 text-gray-700">
          <p>
            <span className="font-medium">First name:</span>{" "}
            {user.user_metadata?.first_name || "-"}
          </p>
          <p>
            <span className="font-medium">Last name:</span>{" "}
            {user.user_metadata?.last_name || "-"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email || "-"}
          </p>
        </div>

        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}