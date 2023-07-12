import Box from "~/components/_common/Box";
import { type BookingRelated } from "~/schemas";
import BookingInfo from ".";
import React from "react";

export default function BookingInfoList({
  bookings,
}: {
  bookings: BookingRelated[];
}) {
  console.log(bookings);
  return (
    <ul className="grid grid-cols-2 gap-6">
      {bookings.length === 0 ? (
        <div>No se encontraron turnos</div>
      ) : (
        bookings.map((booking) => {
          return (
            <li key={booking.id}>
              <Box
                size="md"
                className="flex items-center justify-between bg-white"
              >
                <BookingInfo booking={booking} />
              </Box>
            </li>
          );
        })
      )}
    </ul>
  );
}
