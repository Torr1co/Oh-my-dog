import { hashSync } from "bcryptjs";
import { z } from "zod";
import { UserCreationSchema } from "~/schemas/user";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .input(UserCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { password, ...userData } = input;

      // Hash the password with the secret key
      const hashedPassword = hashSync(
        password + process.env.HASHED_PASSWORD,
        10
      );

      // Create the user with the hashed password
      return ctx.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  delete: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.delete({ where: { email: input } });
  }),
});
