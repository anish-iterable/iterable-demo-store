import { supabase } from "@/lib/supabase";
import {
  iterableTrackEvent,
  iterableUsersUpdate,
} from "@/lib/iterable-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, email } = body;

    if (!firstName || !email) {
      return NextResponse.json(
        { error: "First name and email are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("newsletter_signups").upsert(
      [
        {
          first_name: firstName,
          email,
        },
      ],
      {
        onConflict: "email",
      }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await iterableUsersUpdate({
      email,
      dataFields: {
        firstName,
        emailMarketingOptIn: true,
        signupSource: "website_newsletter",
      },
    });

    await iterableTrackEvent({
      email,
      eventName: "Newsletter Signup",
      dataFields: {
        signupSource: "website_newsletter",
        formLocation: "newsletter_page",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}