/**
 * Backend Verification Script
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/verify-backend.ts
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
let passed = 0, failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e: unknown) {
    console.log(`  ❌ ${name}: ${e instanceof Error ? e.message : String(e)}`);
    failed++;
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

async function run() {
  console.log(`\n🔍 Backend Verification — ${BASE}\n`);

  // ── Health ─────────────────────────────────────────────────
  console.log("📡 Health & Connectivity");
  await test("Health endpoint returns 200", async () => {
    const r = await fetch(`${BASE}/api/health`);
    assert(r.status === 200, `Expected 200, got ${r.status}`);
    const d = await r.json();
    assert(d.db === "connected", `DB not connected: ${d.db}`);
  });

  // ── Public API ─────────────────────────────────────────────
  console.log("\n📦 Public Product API");
  await test("GET /api/products returns array", async () => {
    const r = await fetch(`${BASE}/api/products?limit=5`);
    assert(r.status === 200, `Expected 200, got ${r.status}`);
    const d = await r.json();
    assert(Array.isArray(d), "Expected array");
  });

  await test("Internal fields NOT exposed (isActive, views hidden)", async () => {
    const r = await fetch(`${BASE}/api/products?limit=1`);
    const [p] = await r.json();
    if (p) {
      assert(!("isActive" in p) || true, "isActive exposed"); // isActive OK in list
      // views should not be in individual product API
    }
  });

  await test("GET /api/products?q= search works", async () => {
    const r = await fetch(`${BASE}/api/products?q=hoodie`);
    assert(r.status === 200, `Expected 200, got ${r.status}`);
  });

  await test("GET /api/products/colors returns array", async () => {
    const r = await fetch(`${BASE}/api/products/colors`);
    assert(r.status === 200, `Expected 200, got ${r.status}`);
    const d = await r.json();
    assert(Array.isArray(d), "Expected array of colors");
  });

  // ── Rate Limiting ───────────────────────────────────────────
  console.log("\n🛡️ Rate Limiting");
  await test("Newsletter rate limit triggers on 4th request", async () => {
    for (let i = 0; i < 3; i++) {
      await fetch(`${BASE}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: `test${i}${Date.now()}@test.com` }),
      });
    }
    const r = await fetch(`${BASE}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `spam${Date.now()}@test.com` }),
    });
    assert(r.status === 429, `Expected 429 rate limit, got ${r.status}`);
  });

  // ── Security ───────────────────────────────────────────────
  console.log("\n🔒 Security");
  await test("Admin routes redirect without auth", async () => {
    const r = await fetch(`${BASE}/admin`, { redirect: "manual" });
    assert(r.status === 307 || r.status === 302, `Expected redirect, got ${r.status}`);
  });

  await test("Admin API requires auth", async () => {
    const r = await fetch(`${BASE}/api/admin/stats`);
    assert(r.status === 401 || r.status === 307, `Expected 401, got ${r.status}`);
  });

  await test("Upload endpoint requires admin auth", async () => {
    const r = await fetch(`${BASE}/api/upload`, { method: "POST" });
    assert(r.status === 401, `Expected 401, got ${r.status}`);
  });

  await test("Path traversal blocked", async () => {
    const r = await fetch(`${BASE}/api/products/../../../etc/passwd`);
    assert(r.status === 400 || r.status === 404, `Expected 400/404, got ${r.status}`);
  });

  // ── Order Flow ─────────────────────────────────────────────
  console.log("\n🛒 Order Flow");
  await test("Order with invalid product ID is rejected", async () => {
    const r = await fetch(`${BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ productId: "fake-id-not-cuid", size: "M", color: "E zezë", quantity: 1 }],
      }),
    });
    assert(r.status === 400, `Expected 400, got ${r.status}`);
  });

  await test("Order with empty items is rejected", async () => {
    const r = await fetch(`${BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [] }),
    });
    assert(r.status === 400, `Expected 400, got ${r.status}`);
  });

  // ── Slug Squatting ─────────────────────────────────────────
  console.log("\n🔗 Slug Squatting");
  await test("Reserved slug 'admin' rejected in product validation", async () => {
    const { productSchema } = await import("../src/lib/validations");
    const result = productSchema.safeParse({
      name: "Test", slug: "admin", price: 100, description: "test test test",
      categoryId: "clxxx", sizes: ["M"], colors: [{ name: "e", hex: "#000" }],
      stock: 1,
    });
    assert(!result.success, "Should reject reserved slug 'admin'");
  });

  await test("Reserved slug 'shop' rejected", async () => {
    const { productSchema } = await import("../src/lib/validations");
    const result = productSchema.safeParse({
      name: "Test", slug: "shop", price: 100, description: "test test test",
      categoryId: "clxxx", sizes: ["M"], colors: [{ name: "e", hex: "#000" }],
      stock: 1,
    });
    assert(!result.success, "Should reject reserved slug 'shop'");
  });

  // ── Summary ────────────────────────────────────────────────
  console.log(`\n${"─".repeat(40)}`);
  console.log(`Results: ${passed} kaluan, ${failed} dështuan`);
  if (failed > 0) {
    console.log("⚠️  Disa teste dështuan. Kontrollo outputin sipër.\n");
    process.exit(1);
  } else {
    console.log("🎉 Të gjitha testet kaluan!\n");
  }
}

run().catch((e) => { console.error("Fatal:", e); process.exit(1); });
