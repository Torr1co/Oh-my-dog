import { type Inquirie } from "@prisma/client";
import React from "react";
import { type BookingRelated } from "~/schemas/bookingSchema";

export default function InquirieInfo({ booking }: { booking: BookingRelated }) {
  const inquirie = booking.inquirie as Inquirie;
  console.log(booking);
  return (
    <dl className="grid grid-cols-2 gap-4">
      {!!inquirie.height && (
        <>
          {" "}
          <dt>Altura: </dt> <dd>{inquirie.height}</dd>{" "}
        </>
      )}
      <dt>Observaciones: </dt>
      <dd>{inquirie.observations}</dd>
    </dl>
  );
}
