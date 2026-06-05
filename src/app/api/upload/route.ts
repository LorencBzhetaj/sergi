import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 10;

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
}

/** Verify the file's real content via magic bytes — not just the client MIME type. */
function isValidImageMagic(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e &&
    buffer[3] === 0x47 && buffer[4] === 0x0d && buffer[5] === 0x0a
  ) return true;
  // WebP: "RIFF"...."WEBP"
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) return true;
  // AVIF: bytes 4-11 = "ftyp" + "avif"/"avis"
  if (
    buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70 &&
    buffer[8] === 0x61 && buffer[9] === 0x76 && (buffer[10] === 0x69 || buffer[10] === 0x69)
  ) return true;
  return false;
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminId = (session.user as { id?: string }).id || "unknown";
  const rl = await checkRateLimit(adminId, "upload");
  if (!rl.success) {
    return NextResponse.json({ error: "Shumë ngarkime. Provoni përsëri pas një ore." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Formati i kërkesës është i pavlefshëm." }, { status: 400 });
  }

  const files = formData.getAll("file") as File[];
  if (!files.length) {
    return NextResponse.json({ error: "Nuk u gjet asnjë skedar." }, { status: 400 });
  }
  if (files.length > MAX_IMAGES) {
    return NextResponse.json({ error: `Maksimumi ${MAX_IMAGES} imazhe në të njëjtën kohë.` }, { status: 400 });
  }

  const results: Array<{ url: string; publicId: string; width: number; height: number }> = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipi i skedarit "${file.type}" nuk lejohet. Lejohen: JPG, PNG, WebP, AVIF.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Skedari "${sanitizeFilename(file.name)}" tejkalon madhësinë maksimale prej 5MB.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verify real file content (magic bytes) — blocks spoofed MIME types
    if (!isValidImageMagic(buffer)) {
      return NextResponse.json(
        { error: "Skedari nuk është një imazh i vlefshëm (përmbajtja nuk përputhet)." },
        { status: 400 }
      );
    }

    try {
      const result = await new Promise<{ secure_url: string; public_id: string; width: number; height: number }>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "bogadni-store/products",
              resource_type: "image",
              use_filename: true,
              unique_filename: true,
            },
            (error, result) => {
              if (error || !result) reject(error ?? new Error("Upload failed"));
              else resolve(result as { secure_url: string; public_id: string; width: number; height: number });
            }
          );
          stream.end(buffer);
        }
      );

      results.push({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      });
    } catch {
      return NextResponse.json({ error: "Ngarkimi i imazhit dështoi. Provoni përsëri." }, { status: 500 });
    }
  }

  return NextResponse.json(results.length === 1 ? results[0] : results);
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { publicId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Kërkesa është e pavlefshme." }, { status: 400 });
  }

  const { publicId } = body;
  if (!publicId || typeof publicId !== "string") {
    return NextResponse.json({ error: "publicId mungon." }, { status: 400 });
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fshirja e imazhit dështoi." }, { status: 500 });
  }
}
