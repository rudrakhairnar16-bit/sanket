import { NextResponse } from "next/server";

const UPSTREAM = "https://translate.google.com/translate_tts";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const cache = new Map<string, Buffer>();
const MAX_ENTRIES = 400;

function getCacheKey(tl: string, text: string) {
  return `${tl}:${text}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tl = url.searchParams.get("tl") || "en";
  const text = url.searchParams.get("text") || "";

  if (!text || text.length > 300) {
    return NextResponse.json(
      { error: "text is required (max 300 characters)" },
      { status: 400 }
    );
  }

  const key = getCacheKey(tl, text);
  const cached = cache.get(key);
  if (cached) {
    return new Response(new Uint8Array(cached), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  const target = `${UPSTREAM}?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(
    tl
  )}&q=${encodeURIComponent(text)}`;

  try {
    const res = await fetch(target, {
      headers: { "User-Agent": UA },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `TTS upstream returned ${res.status}` },
        { status: 502 }
      );
    }

    const buf = Buffer.from(await res.arrayBuffer());
    if (cache.size >= MAX_ENTRIES) cache.clear();
    cache.set(key, buf);

    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "TTS upstream unreachable" },
      { status: 502 }
    );
  }
}
