import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(`newsletter:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Shumë kërkesa. Provoni përsëri më vonë." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Email-i nuk është i vlefshëm." }, { status: 400 });
    }

    await prisma.newsletter.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ndodhi një gabim." }, { status: 500 });
  }
}
