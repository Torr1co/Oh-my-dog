import { z } from "zod";

export const UserCreationSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["VET", "CLIENT"]),
});

export type UserCreation = z.infer<typeof UserCreationSchema>;
