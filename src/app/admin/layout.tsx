import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "./AdminSidebar";

// Admin pages must never be cached (always reflect live auth + data)
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get("x-pathname") || "";
  const onLoginPage = pathname.endsWith("/admin/login");

  // Resolve session safely (old/invalid cookie must not crash)
  let isAdmin = false;
  try {
    const session = await auth();
    isAdmin = !!session && (session.user as { role?: string }).role === "ADMIN";
  } catch {
    isAdmin = false;
  }

  // ── Login page: render bare (no sidebar). Redirect to dashboard if already in. ──
  if (onLoginPage) {
    if (isAdmin) redirect("/admin");
    return <>{children}</>;
  }

  // ── Any other admin route requires a valid admin session ──
  if (!isAdmin) {
    redirect("/admin/login");
  }

  // ── Authenticated admin shell (sidebar always rendered here) ──
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      <main className="flex-1 pt-14 md:pt-0 p-4 md:p-8 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
