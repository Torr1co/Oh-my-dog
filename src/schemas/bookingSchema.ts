import {
  BookingType,
  TimeZone,
  VaccineType,
  type Booking,
  type Pet,
  type Vaccine,
  type Deworming,
  type Castration,
  type Inquirie,
  type User,
} from "@prisma/client";
import { z } from "zod";
import { BookingStatus } from "@prisma/client";
import { DewormingCompletionSchema } from "./dewormingSchema";
import { CastrationCompletionSchema } from "./castrationSchema";
import { VaccineCompletionSchema } from "./vaccineSchema";
import { InquirieCompletionSchema } from "./inquirieSchema";

export type BookingRelated = Booking & {
  dog?: Pet | null;
  user?: User | null;
  vaccine?: Vaccine;
  deworming?: Deworming;
  castration?: Castration;
  inquirie?: Inquirie;
};

export const BookingSchema = z.object({
  date: z.date({
    required_error: "Requerido",
    invalid_type_error: "Requerido",
  }),
  type: z.nativeEnum(BookingType),
  timeZone: z.nativeEnum(TimeZone, {
    errorMap: () => {
      return { message: "Selecciona un horario valido" };
    },
  }),
  vaccineType: z.optional(
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
      status: z.nativeEnum(BookingStatus),
    })
  )
  .default({ status: BookingStatus.APPROVED });

export const BookingCompletionSchema = z.object({
  bookingId: z.string(),
  castration: z.optional(CastrationCompletionSchema),
  deworming: z.optional(DewormingCompletionSchema),
  vaccine: z.optional(VaccineCompletionSchema),
  general: z.optional(InquirieCompletionSchema),
  weight: z
    .number({
      required_error: "Requerido",
      invalid_type_error: "Requerido",
    })
    .min(1)
    .max(150, "No puede pesar mas de 150"),
  payAmount: z
    .number({
      required_error: "Requerido",
      invalid_type_error: "Requerido",
    })
    .min(1,"Minimo Coste 1"),
});

export type BookingCompletionSchema = z.infer<typeof BookingCompletionSchema>;
export type CastrationCompletionSchema = z.infer<
  typeof CastrationCompletionSchema
>;
export type BookingSchema = z.infer<typeof BookingSchema>;
export type BookingUpdateSchema = z.infer<typeof BookingUpdateSchema>;
export type BookingCreationSchema = z.infer<typeof BookingCreationSchema>;
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

export const BookingStatusOptions = [
  {
    value: BookingStatus.COMPLETED,
    label: "Turnos pasados",
  },
  {
    value: BookingStatus.APPROVED,
    label: "Turnos aprobados",
  },
  {
    value: BookingStatus.PENDING,
    label: "Turnos por aprobar",
  },
] as const;

export const BookingTypeOptions = [
  {
    value: BookingType.VACCINE,
    label: "Vacuna",
  },
  {
    value: BookingType.DEWORMING,
    label: "Desparasitacion",
  },
  {
    value: BookingType.GENERAL,
    label: "Consulta General",
  },
  {
    value: BookingType.CASTRATION,
    label: "Castracion",
  },
] as const;

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
] as const;
