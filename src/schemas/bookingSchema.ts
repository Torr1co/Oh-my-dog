import { InquirieType, TimeZone, VaccineType } from "@prisma/client";
import { z } from "zod";

export const BookingSchema = z.object({
  date: z.date({
    required_error: "Requerido",
    invalid_type_error: "Requerido",
  }),
  type: z.nativeEnum(InquirieType),
  timeZone: z.nativeEnum(TimeZone, {
    errorMap: () => {
      return { message: "Selecciona un horario valido" };
    },
  }),
  vaccine: z.optional(
    z.nativeEnum(VaccineType, {
      errorMap: () => {
        return { message: "Selecciona una vacuna valida" };
      },
    })
  ),
});

export const BookingCreationSchema = BookingSchema.extend({
  dog: z.string({
    required_error: "Requerido",
    invalid_type_error: "Requerido",
  }), // should be dogId
  user: z.optional(z.string()), // should be userId
});

export const BookingUpdateSchema = z.object({
  booking: BookingCreationSchema.omit({
    user: true,
    dog: true,
  }).extend({
    id: z.string(),
  }),
  dog: z.string(), // should be dogId
});

export const BookingGetAllSchema = z
  .optional(
    z.object({
      pending: z.boolean(),
    })
  )
  .default({ pending: true });

export type Booking = z.infer<typeof BookingSchema>;
export type BookingUpdate = z.infer<typeof BookingUpdateSchema>;
export type BookingCreation = z.infer<typeof BookingCreationSchema>;
export type BookingGetAllSchema = z.infer<typeof BookingGetAllSchema>;

export const VaccineOptions = [
  {
    value: VaccineType.A,
    label: "Tipo A",
  },
  {
    value: VaccineType.B,
    label: "Tipo B (Antirrabica)",
  },
] as const;

export const InquirieOptions = [
  {
    value: InquirieType.VACCINE,
    label: "Vacuna",
  },
  {
    value: InquirieType.DEWORMING,
    label: "Desparasitacion",
  },
  {
    value: InquirieType.GENERAL,
    label: "General",
  },
];

export const TimeZoneOptions = [
  {
    value: TimeZone.MORNING,
    label: "Mañana",
  },
  {
    value: TimeZone.AFTERNOON,
    label: "Tarde",
  },
  {
    value: TimeZone.EVENING,
    label: "Anochecer",
  },
];
