import { trip, directionsUrl } from "./data/trip.js";
import { initializeMotion } from "./lib/motion.js";
import { initializeGallery } from "./lib/gallery.js";
import {
  calculateBudget,
  money,
  exactMoney,
  rentalTotal,
  sharedTransport,
} from "./lib/budget.js";

const $ = (id) => document.getElementById(id);
let count = 4;
let toastTimer;

function update() {
  const nightly = Number($("nightly").value);
  const two = $("twoRooms").checked && count >= 3;
  $("nightlyVal").textContent = money(nightly);
  $("roomToggle").style.opacity = count >= 3 ? "1" : ".5";
  $("twoRooms").disabled = count < 3;
  const budget = calculateBudget(count, nightly, two);
  for (const [id, value] of Object.entries({
    perDay: budget.perDay,
    perPerson: budget.perPerson,
    transport: sharedTransport,
    hotelTotal: budget.hotels,
    personalTotal: budget.personal,
    groupTotal: budget.total,
  }))
    $(id).textContent = money(value);
  const saving = (calculateBudget(2, nightly).perPerson - budget.perPerson) * 2;
  $("saving").textContent =
    count === 1
      ? "🧭 Going solo means covering the whole car and room."
      : count === 2
        ? "💛 Mateo & Daniela: the baseline cost for the two of us."
        : saving > 0
          ? `💰 Mateo & Daniela could save ${money(saving)} together compared with traveling as a couple.`
          : "🛏️ Extra hotel rooms can offset the savings from sharing the car.";
  document.querySelectorAll(".option").forEach((button) => {
    const active = Number(button.dataset.n) === count;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  $("scenarioCaption").textContent = two
    ? "Two rooms for groups of 3–4; one room for 1–2 travelers"
    : "One shared room, subject to hotel occupancy limits";
  $("scenarioRows").innerHTML = [1, 2, 3, 4]
    .map((n) => {
      const b = calculateBudget(n, nightly, two);
      return `<tr class="${n === count ? "highlight" : ""}"><td>${n} · ${["solo", "couple", "+1 friend", "+2 friends"][n - 1]}</td><td>${money(b.perDay)}</td><td>${money(b.perPerson)}</td><td>${money(b.total)}</td></tr>`;
    })
    .join("");
}

function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 4000);
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      /* report failure below */
    }
    textarea.remove();
    return copied;
  }
}

$("routeLinks").innerHTML = trip.routes
  .map(
    (route) =>
      `<a class="maplink" href="${directionsUrl(route)}" target="_blank" rel="noopener noreferrer">${route.label} ↗</a>`,
  )
  .join("");

const { transport } = trip;
$("transportDetails").innerHTML = `
  <div class="transport-details">
    <div class="eyebrow">Transport estimate · CAD · not booked</div>
    <h3>Refundable rate + Standard protection</h3>
    <div class="transport-grid">
      <div><span>Refundable rental</span><strong>${exactMoney(transport.refundableRental)}</strong></div>
      <div><span>Standard · 11 quoted days</span><strong>${exactMoney(transport.standardProtection)}</strong></div>
      <div><span>Rental + protection</span><strong>${exactMoney(rentalTotal)}</strong></div>
    </div>
    <p>Fuel: ${money(transport.fuel.min)}–${money(transport.fuel.max)} · Parking: ${money(transport.parking.min)}–${money(transport.parking.max)}.</p>
    <p><b>Transport range: ${exactMoney(rentalTotal + transport.fuel.min + transport.parking.min)}–${exactMoney(rentalTotal + transport.fuel.max + transport.parking.max)}</b> for the group, or ${exactMoney((rentalTotal + transport.fuel.min + transport.parking.min) / 2)}–${exactMoney((rentalTotal + transport.fuel.max + transport.parking.max) / 2)} each for two people.</p>
    <p class="small">The calculator uses midpoint estimates: ${money(transport.fuel.estimate)} fuel + ${money(transport.parking.estimate)} parking. Additional taxes, tolls, extraordinary charges and quote changes are excluded. Protection details in the planning notes still require verification against current terms.</p>
    <h3>Before we book</h3>
    <ul class="booking-checks">${trip.pending.map((item) => `<li>${item}</li>`).join("")}</ul>
    <a class="maplink" href="https://turo.com/ca/en/car-rental/canada" target="_blank" rel="noopener noreferrer">Review Turo Canada and current protection terms ↗</a>
  </div>`;

document.querySelectorAll(".option").forEach((button) =>
  button.addEventListener("click", () => {
    count = Number(button.dataset.n);
    if (count < 3) $("twoRooms").checked = false;
    update();
  }),
);
$("nightly").addEventListener("input", update);
$("twoRooms").addEventListener("change", update);
$("printPage").addEventListener("click", () => window.print());
$("shareTrip").addEventListener("click", async () => {
  const url = new URL(window.location.href);
  url.hash = "";
  try {
    if (navigator.share) {
      await navigator.share({ title: "The Great Québec Loop", url: url.href });
      return;
    }
    toast(
      (await copy(url.href))
        ? "Trip link copied — ready to share!"
        : "Copy the address from your browser to share the trip.",
    );
  } catch (error) {
    if (error.name !== "AbortError")
      toast(
        (await copy(url.href))
          ? "Trip link copied!"
          : "Copy the address from your browser to share the trip.",
      );
  }
});
$("copyInvite").addEventListener("click", async () => {
  const two = $("twoRooms").checked && count >= 3;
  const budget = calculateBudget(4, Number($("nightly").value), two);
  const message = `❄️🚙 COME JOIN OUR QUÉBEC WINTER ROAD TRIP!\nMateo & Daniela · Toronto → Québec City → Montréal → Ottawa · Dec 23, 2026 – Jan 3, 2027. TWO open seats!\nFor four travelers: about ${money(budget.perDay)} per person per travel day (${money(budget.perPerson)} total), using 11 travel days and 10 hotel nights. Assumes ${two ? "two hotel rooms" : "one shared hotel room, subject to occupancy limits"}.\nCar and hotels are not booked. Prices, pickup/return times and winter tires need confirmation. A suggested CA$400 advance per joining friend counts toward the final share, after agreeing on bookings and refund terms.\nSee the plan: ${window.location.href.split("#")[0]}`;
  toast(
    (await copy(message))
      ? "Invitation copied — ready to share! 💌"
      : "Could not copy. Please use your browser’s share option.",
  );
});
update();
initializeMotion();
initializeGallery();
