import { NextRequest, NextResponse } from "next/server";
import {
  BookingError,
  createBooking,
  validateBookingInput,
} from "@/lib/bookings";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = validateBookingInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const booking = await createBooking(parsed.value);
    return NextResponse.json({ booking }, { status: 201 });
  } catch (e) {
    if (e instanceof BookingError) {
      return NextResponse.json(
        { error: e.message, code: e.code, remaining: e.remaining },
        { status: 409 }
      );
    }
    console.error("create booking error", e);
    return NextResponse.json(
      { error: "The reservation desk is unreachable — please try again." },
      { status: 500 }
    );
  }
}
