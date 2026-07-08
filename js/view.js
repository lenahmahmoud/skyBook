import { getOneFlight } from "./flights.js";

const params = new URLSearchParams(window.location.search);
const flightId = params.get("id");

async function createMainSection() {
  const flight = await getOneFlight(flightId);
  console.log(flight);
  console.log(flight.airline);
  const airline = document.getElementsByClassName("airline")[0];
  airline.innerText = `${flight.airline}- ${flight.flightNumber}`;

  document.getElementsByClassName("airportdep")[0].innerText =
    ` ${flight.cityFrom} (${flight.airportDeparture}) `;
  document.getElementsByClassName("airportarr")[0].innerText =
    ` ${flight.cityDestination} (${flight.airportDestination}) `;

  document.getElementsByClassName("duration")[0].innerText =
    `${flight.durationTime}`;
  document.getElementsByClassName("departureClock")[0].innerText =
    `${flight.departureClock}`;
  document.getElementsByClassName("dep")[0].innerText =
    `${flight.airportDeparture}`;
  document.getElementsByClassName("depDate")[0].innerText =
    `${flight.departureDate}`;
  document.getElementsByClassName("arrivalClock")[0].innerHTML =
    `${flight.arrivalClock}`;
  document.getElementsByClassName("arriv")[0].innerHTML =
    `${flight.airportDestination}`;
  document.getElementsByClassName("arrivDate")[0].innerHTML = `${
    flight.arrivalDate
  }`;
  document.getElementsByClassName('aircraft-model')[0].innerText = flight.aircraft;
document.getElementsByClassName('aircraft-speed')[0].innerText = flight.speedOfThePlane;
document.getElementsByClassName('aircraft-seats-available')[0].innerText = flight.seatsAvailable;

document.getElementsByClassName('amenity-wifi')[0].innerText = flight.wifi ? 'Wi-Fi available' : 'No Wi-Fi';
document.getElementsByClassName('amenity-meal')[0].innerText = 'Meal included'; // static, not in your db
document.getElementsByClassName('amenity-entertainment')[0].innerText = 'In-flight entertainment'; // static, not in your db
}

await createMainSection();
