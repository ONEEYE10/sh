import { NextResponse } from "next/server";
import type { Quote } from "@/types/weather";

export async function GET(): Promise<NextResponse> {
  try {
    const res = await fetch("https://api.quotable.io/quotes/random?tags=inspirational&limit=1", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Quotable API error: ${res.status}`);
    }

    const data: { content: string; author: string }[] = await res.json();
    const quote: Quote = {
      content: data[0]?.content ?? "Every day is a new beginning.",
      author: data[0]?.author ?? "Unknown",
    };

    return NextResponse.json(quote);
  } catch {
    const fallback: Quote = {
      content: "In every walk with nature, one receives far more than he seeks.",
      author: "John Muir",
    };
    return NextResponse.json(fallback);
  }
}
