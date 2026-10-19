import { NextRequest, NextResponse } from "next/server";
import { availabilityForDate } from "@/lib/bookings";
import { isValidDateStr } from "@/lib/museum";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!isValidDateStr(date)) {
    return NextResponse.json(
      { error: "Provide ?date=YYYY-MM-DD" },
      { status: 400 }
    );
  }
  try {
    const availability = await availabilityForDate(date);
    return NextResponse.json(availability, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error("availability error", e);
    return NextResponse.json(
      { error: "Could not load availability." },
      { status: 500 }
    );
  }
}
