import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type Session,
} from "next-auth";
import CredentialProviders from "next-auth/providers/credentials";
import { prisma } from "~/server/db";
import { type User } from "@prisma/client";
import { compareSync } from "bcryptjs";
import { hasKey } from "~/utils/language/objUtils";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: Omit<User, "password"> /*  & DefaultSession["user"]; */;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user as User | null) {
        token.user = user;
      }
      if (trigger === "update" && session) {
        /* if ((session as Partial<Session["user"]>).passwordVerified) {
          (token.user as Session["user"]).passwordVerified = (
            session as Partial<Session["user"]>
          ).passwordVerified as Date;
        } */

        Object.entries(session as Partial<Session["user"]>).forEach(
          ([key, value]) => {
            if (!!value) {
              if (
                hasKey(
                  token.user as Session["user"],
                  key as keyof Session["user"]
                )
              ) {
                (token.user as Record<typeof key, typeof value>)[key] = value;
              }
            }
          }
        );
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      session.user = token.user as Session["user"];
      return Promise.resolve(session);
    },
  },
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialProviders({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found");
        }

        const isPasswordValid = compareSync(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;
      },
    }),
  ],
  // pages: { signIn: "/auth/signIn", newUser: "/newUser" },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  return session;
};

export const getTrpcProps = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return {
    session: await getServerAuthSession(ctx),
    prisma,
  };
};
