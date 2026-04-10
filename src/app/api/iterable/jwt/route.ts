import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type JwtRequestBody = {
  email?: string;
  userId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as JwtRequestBody;
    const { email, userId } = body;

    if (!email && !userId) {
      return NextResponse.json(
        { error: "email or userId is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ITERABLE_WEB_API_KEY;
    const jwtSecret = process.env.ITERABLE_WEB_API_SECRET;

    if (!apiKey || !jwtSecret) {
      return NextResponse.json(
        { error: "Missing Iterable web SDK configuration" },
        { status: 500 }
      );
    }

    const payload: Record<string, string> = {
      apiKey,
    };

    if (email) payload.email = email;
    if (userId) payload.sub = userId;

    const token = jwt.sign(payload, jwtSecret, {
      algorithm: "HS256",
      expiresIn: "5m",
    });

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate Iterable JWT" },
      { status: 500 }
    );
  }
}