import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {
  isConfiguredAdminEmail,
  upsertConfiguredAdminUser,
  verifyConfiguredAdminPassword,
} from "@/lib/admin-config";
import { prisma } from "@/lib/prisma";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "credentials",
    credentials: { email: {}, password: {} },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null;

      const email = credentials.email.trim().toLowerCase();
      if (isConfiguredAdminEmail(email)) {
        const ok = await verifyConfiguredAdminPassword(email, credentials.password);
        if (!ok) return null;
        const admin = await upsertConfiguredAdminUser(email);
        return { id: admin.id, email: admin.email, name: admin.name };
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.password) return null;
      const ok = await compare(credentials.password, user.password);
      if (!ok) return null;
      return { id: user.id, email: user.email, name: user.name };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub ?? "";
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
