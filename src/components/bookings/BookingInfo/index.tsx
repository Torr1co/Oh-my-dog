import dayjs from "dayjs";
import React from "react";
import { BookingTypeOptions, TimeZoneOptions } from "~/schemas";
import { type BookingRelated } from "~/schemas/bookingSchema";
import { getOptionLabel } from "~/utils/schemaUtils";
import { useSession } from "next-auth/react";
import { isVet } from "~/utils/schemas/usersUtils";
import { BookingType } from "@prisma/client";
import CastrationInfo from "./CastrationInfo";
import DewormingInfo from "./DewormingInfo";
import InquirieInfo from "./InquirieInfo";
import VaccineInfo from "./VaccineInfo";
import UrgencyInfo from "./UrgencyInfo";

const BookingTypeInfoConvertion = {
  [BookingType.CASTRATION]: CastrationInfo,
  [BookingType.DEWORMING]: DewormingInfo,
  [BookingType.GENERAL]: InquirieInfo,
  [BookingType.VACCINE]: VaccineInfo,
  [BookingType.URGENCY]: UrgencyInfo,
} as const;

export default function BookingInfo({ booking }: { booking: BookingRelated }) {
  const { data: session } = useSession();
  const BookingTypeInfo = BookingTypeInfoConvertion[booking.type];

  return (
    <div className="grid h-full w-full gap-6">
      <dl className="grid grid-cols-2">
        <dt>Fecha:</dt>
        <dd>{dayjs(booking.date).format("MMMM D, YYYY ")}</dd>
        <dt>Tipo de turno:</dt>
        <dd>{getOptionLabel(BookingTypeOptions, booking.type)}</dd>
        {booking.type === BookingType.VACCINE && (
          <>
            <dt>Tipo de vacuna:</dt>
            <dd>{booking.vaccineType}</dd>
          </>
        )}
        <dt>Horario:</dt>
        <dd>
          <span className="capitalize">
            {getOptionLabel(TimeZoneOptions, booking.timeZone)}
          </span>
        </dd>

        <dt>Nombre del perro:</dt>
        <dd>
          <span className="capitalize">{booking.dog.name}</span>
        </dd>
        {isVet(session?.user) && (
          <>
            <dt>Nombre del cliente:</dt>
            <dd>
              <span className="capitalize">{booking.user.name}</span>
            </dd>
          </>
        )}
        <dt>Peso registrado del perro: </dt>
        <dd>{booking.weight}</dd>
      </dl>
      <BookingTypeInfo booking={booking} />
    </div>
  );
}
