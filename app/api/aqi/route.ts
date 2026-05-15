import { NextResponse } from "next/server";
import { getCityAqi } from "@/lib/aqi/service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city")?.trim();
  if (!city) {
    return NextResponse.json({ error: "Missing 'city' query param." }, { status: 400 });
  }
  try {
    const result = await getCityAqi(city);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
