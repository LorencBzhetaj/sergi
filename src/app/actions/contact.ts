"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

export async function submitContact(data: unknown) {
  let ip = "unknown";
  try {
    const h = await headers();
    ip = h.get("x-forwarded-for") || "unknown";
  } catch {}

  const rl = await checkRateLimit(ip, "contact");
  if (!rl.success) {
    return { error: "Shumë kërkesa. Provoni përsëri pas një ore." };
  }

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Të dhënat janë të pavlefshme." };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message,
      },
    });
    return { success: true };
  } catch {
    return { error: "Ndodhi një gabim. Provoni përsëri." };
  }
}
