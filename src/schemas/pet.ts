import { z } from "zod";

export const PetSchema = z.object({
  name: z.string().min(1,"Minimo 1 caracter").max(20,"Maximo 20 caracteres"),
  birth: z.date({
    required_error : "Requerido",
    invalid_type_error : "Requerido"
  }),
  gender: z.string(),
  color: z.string(),
  weight: z.number({
    required_error : "Requerido",
    invalid_type_error : "Requerido"
  }).max(150,"No puede pesar mas de 150"),
  height: z.number({
    required_error : "Requerido",
    invalid_type_error : "Requerido"
  }).max(200,"No puede medir mas de 200"),
  img: z.optional(z.string()),
  race: z.string().min(1,"Minimo 1 caracter"),
  castrated: z.optional(z.boolean()).default(false),
  letsCross: z.optional(z.boolean()).default(false),
  observations: z.optional(z.string()).default(""),
});

export const PetCreationSchema = PetSchema.extend({
  owner: z.string(),
});

export type PetCreation = z.infer<typeof PetCreationSchema>;
export type PetSchema = z.infer<typeof PetSchema>;

export const GenderOptions = [
  {
    value: "MALE",
    label: "Macho",
  },
  {
    value: "FEMALE",
    label: "Hembra",
  },
];
