// CAD estimates supplied by Mateo; no booking or coverage is confirmed.
export const trip = {
  travelDays: 11,
  hotelNights: 10,
  personalPerTraveler: 675,
  extraAdultPerNight: 20,
  transport: {
    refundableRental: 719.74,
    standardProtection: 252.34,
    fuel: { min: 350, estimate: 380, max: 410 },
    parking: { min: 150, estimate: 220, max: 300 },
    includedKm: 2750,
  },
  routes: [
    {
      label: "Dec 23 · Toronto → Kingston",
      origin: "Toronto, Ontario",
      destination: "Kingston, Ontario",
    },
    {
      label: "Dec 24 · Kingston → Québec City",
      origin: "Kingston, Ontario",
      destination: "Quebec City, Quebec",
    },
    {
      label: "Dec 28 · Québec → Trois-Rivières → Montréal",
      origin: "Quebec City, Quebec",
      destination: "Montreal, Quebec",
      waypoints: "Trois-Rivieres, Quebec",
    },
    {
      label: "Jan 1 · Montréal → Ottawa",
      origin: "Montreal, Quebec",
      destination: "Ottawa, Ontario",
    },
    {
      label: "Jan 2 · Ottawa → Toronto",
      origin: "Ottawa, Ontario",
      destination: "Toronto, Ontario",
    },
  ],
  pending: [
    "Confirm pickup after 4 PM on Dec 23 and the Jan 3 return time; recalculate the final rental duration and quote.",
    "Confirm installed winter tires and their condition with the host; check the mileage allowance and excess-kilometre rate.",
    "Review the current Turo Canada Standard terms, exclusions and eligible-damage responsibility before booking.",
    "Check whether your Ontario auto policy or credit card explicitly covers Turo; do not assume rental-car coverage applies.",
    "Confirm hotel availability, occupancy limits, parking, holiday opening hours and cancellation terms.",
  ],
};

export function directionsUrl(route) {
  return `https://www.google.com/maps/dir/?${new URLSearchParams({
    api: "1",
    origin: route.origin,
    destination: route.destination,
    travelmode: "driving",
    ...(route.waypoints ? { waypoints: route.waypoints } : {}),
  })}`;
}
