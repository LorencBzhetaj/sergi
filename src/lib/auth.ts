import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true, // required for Vercel (dynamic host) + non-standard ports
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Rate limit login attempts by email
        const reqAsAny = req as unknown as { headers?: { get?: (k: string) => string | null } };
        const ip = reqAsAny?.headers?.get?.("x-forwarded-for") || "unknown";
        const rl = await checkRateLimit(`${ip}:${email}`, "login");
        if (!rl.success) {
          // Log rate limit hit
          try {
            await prisma.auditLog.create({
              data: {
                action: "LOGIN_RATE_LIMITED",
                entity: "User",
                ip,
                metadata: { email },
              },
            });
          } catch {}
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Always run bcrypt to prevent timing attacks (even if user not found)
        const dummyHash = "$2b$10$dummy.hash.to.prevent.timing.attacks.xxxxxxxxxxxxxxx";
        const valid = await bcrypt.compare(password, user?.password ?? dummyHash);

        if (!user || !user.password || !valid || user.role !== "ADMIN") {
          // Log failed attempt
          try {
            await prisma.auditLog.create({
              data: {
                action: "LOGIN_FAILED",
                entity: "User",
                ip,
                metadata: { email },
              },
            });
          } catch {}
          return null;
        }

        // Log successful login
        try {
          await prisma.auditLog.create({
            data: {
              adminId: user.id,
              action: "LOGIN_SUCCESS",
              entity: "User",
              entityId: user.id,
              ip,
            },
          });
        } catch {}

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
