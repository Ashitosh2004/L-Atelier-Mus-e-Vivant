import { NextRequest, NextResponse } from "next/server";
import { cancelBooking, lookupBooking, validEmail } from "@/lib/bookings";
import { isValidReference } from "@/lib/museum";

type Ctx = { params: Promise<{ reference: string }> };

function unauthorized() {
  return NextResponse.json(
    { error: "No reservation found for that reference and email." },
    { status: 404 }
  );
}

/** Look up a booking by reference — requires the holder's email. */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { reference } = await ctx.params;
  if (!isValidReference(reference)) return unauthorized();
  const email = req.nextUrl.searchParams.get("email") ?? "";
  if (!validEmail(email)) return unauthorized();

  try {
    const booking = await lookupBooking(reference.toUpperCase(), email);
    if (!booking) return unauthorized();
    return NextResponse.json(
      { booking },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("lookup error", e);
    return NextResponse.json(
      { error: "The reservation desk is unreachable — please try again." },
      { status: 500 }
    );
  }
}

/** Cancel a booking — frees the spots for other visitors. */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { reference } = await ctx.params;
  if (!isValidReference(reference)) return unauthorized();
  const email = req.nextUrl.searchParams.get("email") ?? "";
  if (!validEmail(email)) return unauthorized();

  try {
    const booking = await cancelBooking(reference.toUpperCase(), email);
    if (!booking) return unauthorized();
    return NextResponse.json({ booking });
  } catch (e) {
    console.error("cancel error", e);
    return NextResponse.json(
      { error: "The reservation desk is unreachable — please try again." },
      { status: 500 }
    );
  }
}
