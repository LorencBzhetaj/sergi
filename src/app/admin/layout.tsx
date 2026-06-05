import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Login page renders without auth check — proxy already protects other routes
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Double-check auth server-side for all other admin routes.
  // Wrap in try/catch: a cookie encrypted with an old AUTH_SECRET throws
  // JWTSessionError ("no matching decryption secret") — treat as logged out.
  let session = null;
  try {
    session = await auth();
  } catch {
    redirect("/admin/login");
  }
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      {/* pt-14 on mobile = space for fixed topbar; lg:pt-0 = desktop has sidebar */}
      <main className="flex-1 pt-14 lg:pt-0 p-4 lg:p-8 overflow-auto min-w-0">{children}</main>
    </div>
  );
}
