import { trip } from "../data/trip.js";

const cents = (value) => Math.round(value * 100) / 100;
export const rentalTotal = cents(
  trip.transport.refundableRental + trip.transport.standardProtection,
);
export const sharedTransport = cents(
  rentalTotal + trip.transport.fuel.estimate + trip.transport.parking.estimate,
);
export const money = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("$", "CA$");
export const exactMoney = (value) =>
  `CA$${value.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function calculateBudget(travelers, nightly, twoRooms = false) {
  if (
    !Number.isInteger(travelers) ||
    travelers < 1 ||
    travelers > 4 ||
    !Number.isFinite(nightly) ||
    nightly < 0
  ) {
    throw new RangeError("Use 1–4 travelers and a nonnegative nightly price.");
  }
  const rooms = twoRooms && travelers >= 3 ? 2 : 1;
  const extraAdults = rooms === 1 ? Math.max(0, travelers - 2) : 0;
  const hotels = cents(
    nightly * trip.hotelNights * rooms +
      extraAdults * trip.extraAdultPerNight * trip.hotelNights,
  );
  const personal = trip.personalPerTraveler * travelers;
  const total = cents(sharedTransport + hotels + personal);
  return {
    hotels,
    personal,
    total,
    perPerson: total / travelers,
    perDay: total / travelers / trip.travelDays,
  };
}
