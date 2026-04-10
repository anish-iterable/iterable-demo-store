import { supabase } from "@/lib/supabase";
import { iterableUsersUpdate } from "@/lib/iterable-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!existingCustomer) {
      const { error } = await supabase.from("customers").insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
        },
      ]);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    await iterableUsersUpdate({
      email,
      dataFields: {
        firstName,
        lastName,
        signupSource: "website_register",
        accountStatus: "registered",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}