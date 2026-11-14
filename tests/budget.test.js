import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateBudget,
  rentalTotal,
  sharedTransport,
} from "../src/lib/budget.js";
import { trip, directionsUrl } from "../src/data/trip.js";

test("refundable rental and Standard match the supplied quote", () => {
  assert.equal(rentalTotal, 972.08);
  assert.equal(sharedTransport, 1572.08);
});
test("couple and four-person room estimates include the correct adult supplements", () => {
  const couple = calculateBudget(2, 150);
  const four = calculateBudget(4, 150);
  assert.equal(couple.hotels, 1500);
  assert.equal(couple.total, 4422.08);
  assert.equal(four.hotels, 1900);
  assert.equal(four.total, 6172.08);
  assert.equal(four.perPerson, 1543.02);
  assert.equal(four.perDay, four.perPerson / 11);
});
test("two rooms remove the extra-adult supplement and do not double rooms for a couple", () => {
  assert.equal(calculateBudget(4, 150, true).hotels, 3000);
  assert.equal(calculateBudget(3, 200, true).hotels, 4000);
  assert.equal(calculateBudget(2, 150, true).hotels, 1500);
});
test("reject invalid traveler counts and prices", () => {
  for (const n of [0, 5, 1.5, NaN])
    assert.throws(() => calculateBudget(n, 150), RangeError);
  for (const price of [-1, NaN, Infinity])
    assert.throws(() => calculateBudget(2, price), RangeError);
});
test("directions preserve the Trois-Rivières stop and use driving mode", () => {
  const url = new URL(directionsUrl(trip.routes[2]));
  assert.equal(url.hostname, "www.google.com");
  assert.equal(url.searchParams.get("waypoints"), "Trois-Rivieres, Quebec");
  assert.equal(url.searchParams.get("travelmode"), "driving");
});
