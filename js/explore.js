import { getFlights } from "./flights.js";

const form = document.forms[0];
const priceRange = form.range;


function airlines(dest) {
  const select = form.airline;
  select.innerHTML = "";
  function createOption(airline) {
    const option = document.createElement("option");
    option.value = airline;
    option.innerText = airline;
    select.appendChild(option);
  }
  createOption("All");
  dest.reduce((acc, current) => {
    const existed = acc.some((d) => {
      return d.airline === current.airline;
    });
    if (!existed) {
      createOption(current.airline);
      acc.push(current);
    }

    return acc;
  }, []);
}
async function getFlightsByDestination() {
  const destinations = await getFlights();

  const filteredDestinations = destinations.filter((des) => {
    return des.cityDestination === localStorage.getItem("destination");
  });

  return filteredDestinations;
}
async function searchResults(des) {
  const span = document.getElementsByClassName("search-res")[0];
  span.innerHTML = `${des.length} Found`;
}
function destCity() {
  const span = document.getElementsByClassName("dest-city")[0];
  span.innerHTML = localStorage.getItem("destination");
}
function createNoMatching(div) {
  const p = document.createElement("p");
  const Div = document.createElement("div");
  Div.classList.add(...["h-full", "w-full"]);
  div.appendChild(Div);
  p.innerHTML = ` No Matching <i class="fa-solid fa-plane-departure  text-[var(--navy-blue)]" ></i>
`;
  p.classList.add(...["font-bold", "text-3xl", "text-[var(--navy-blue)]"]);
  Div.classList.add(...["flex", "justify-center", "items-center"]);
  Div.appendChild(p);
}
async function createFlightsCards(destinations = " ") {
  const contentDiv = document.getElementsByClassName("content")[0];
  contentDiv.innerHTML = "";

  if (destinations === " ") {
    destinations = await getFlightsByDestination();
  }

  destinations.forEach((dest) => {
    const article = document.createElement("article");
    article.classList.add(
      ...[
        "p-5",
        "border-gray-200",
        "border",
        "font-bold",
        "flex",
        "gap-3",
        "justify-between",
        "rounded-lg",
        "items-center",
      ],
    );

    const divLogo = document.createElement("div");
    divLogo.classList.add(...["flex", "gap-2", "items-center", "flex-1"]);

    const logo = document.createElement("div");
    const img = document.createElement("img");
    img.src = `${dest.logoimage}`;
    img.classList.add(...["size-10"]);

    const divText = document.createElement("div");
    divText.classList.add(...["flex", "flex-col", "gap-1"]);

    const h3 = document.createElement("h3");
    h3.innerText = dest.airline;

    const spanflightNumber = document.createElement("span");
    spanflightNumber.innerText = `${dest.flightNumber}`;
    spanflightNumber.classList.add(...["text-gray-500", "text-sm"]);

    const divDepTime = document.createElement("div");
    divDepTime.classList.add(...["text-center", "flex-1"]);

    const pDepTime = document.createElement("p");
    pDepTime.innerText = `${dest.departureDate}`;
    const pAirportDeparture = document.createElement("p");
    pAirportDeparture.innerText = `${dest.airportDeparture}`;

    const containerDuration = document.createElement("div");
    containerDuration.classList.add(
      ...["flex", "flex-col", "items-center", "flex-1"],
    );

    const spanDurationTime = document.createElement("span");
    spanDurationTime.innerHTML = `${dest.durationTime}`;

    const divDuration = document.createElement("div");
    divDuration.classList.add(...["flex", "gap-1", "items-center"]);

    const spanDepIcon = document.createElement("span");
    spanDepIcon.innerHTML = `
       <i class="fa-solid fa-plane-departure text-[var(--navy-blue)]"></i>`;

    const divLine = document.createElement("div");
    divLine.classList.add(...["h-[1px]", "bg-gray-500", "w-[150px]"]);

    const spanArrivalIcon = document.createElement("span");
    spanArrivalIcon.innerHTML = `                                <i class="fa-solid fa-plane-arrival text-[var(--navy-blue)]"></i>`;

    const spanStops = document.createElement("span");
    spanStops.innerHTML = `${dest.stop}`;

    const divArrival = document.createElement("div");
    divArrival.classList.add(...["text-center", "flex-1"]);
    const arrivalTime = document.createElement("p");
    arrivalTime.innerHTML = `${dest.arrivalDate}`;
    divArrival.appendChild(arrivalTime);

    const arrivalAirport = document.createElement("p");
    arrivalAirport.innerHTML = `${dest.airportDestination}`;
    divArrival.appendChild(arrivalAirport);

    const divPrice = document.createElement("div");
    divPrice.classList.add(
      ...["flex-1", "flex", "flex-col", "items-center", "gap-1"],
    );

    const spanPrice = document.createElement("span");
    spanPrice.innerHTML = `$${dest.price} `;
    spanPrice.classList.add(...["text-2xl"]);

    const seats = document.createElement("span");
    seats.innerHTML = `${dest.seatsAvailable} seats left`;
    seats.classList.add(...["text-red-400", "text-sm"]);

    const viewButton = document.createElement("button");
    viewButton.innerText = "View Details";
    viewButton.classList.add(
      ...[
        "bg-[var(--navy-blue)]",
        "p-2",
        "text-sm",
        "rounded-lg",
        "text-white",
        "cursor-pointer",
      ],
    );
    viewButton.addEventListener("click", () => {
      window.location.href = `./viewdetails.html?id=${dest.flightId}`;
    });

    divPrice.appendChild(spanPrice);
    divPrice.appendChild(seats);
    divPrice.appendChild(viewButton);

    logo.appendChild(img);
    divDepTime.appendChild(pDepTime);
    divDepTime.appendChild(pAirportDeparture);
    divLogo.appendChild(logo);
    divText.appendChild(h3);
    divText.appendChild(spanflightNumber);
    divLogo.appendChild(divText);
    divDuration.appendChild(spanDepIcon);
    divDuration.appendChild(divLine);
    divDuration.appendChild(spanArrivalIcon);
    article.appendChild(divLogo);
    article.appendChild(divDepTime);
    containerDuration.appendChild(spanDurationTime);
    containerDuration.appendChild(divDuration);
    containerDuration.appendChild(spanStops);
    article.appendChild(containerDuration);
    article.appendChild(divArrival);
    article.appendChild(divPrice);
    contentDiv.appendChild(article);
  });
  searchResults(destinations);

  if (contentDiv.innerHTML === "") {
    createNoMatching(contentDiv);
  }
}
async function filterHelper(airline, maxPrice, stop, depTime) {
  const flights = await getFlightsByDestination();
  const filtered = flights.filter((f) => {
    if (airline && f.airline !== airline && airline != "All") return false;
    if (maxPrice && f.price > Number(maxPrice)) return false;
    if (stop.length > 0 && !stop.includes(f.stop)) return false;
    if (depTime && f.departurePeriod !== depTime) return false;
    return true;
  });

  return filtered;
}

async function handleFilters(e) {
  e.preventDefault();
  const data = new FormData(form);
  const airline = data.get("airline") || "";
  const range = data.get("range") || "";
  const stops = data.getAll("stops") || "";
  const depTime = data.get("timedep") || "";

  const f = await filterHelper(airline, range, stops, depTime);
  await createFlightsCards(f);
  console.log(airline, typeof stops, depTime, range);
  console.log(f);
}
function isAvailable(flight, cabin, passengers) {
  const availableSeats = flight.seats.filter((seat) => {
    return seat.class === cabin && seat.available;
  });

  return availableSeats.length >= passengers;
}

async function sortCards(value) {
  const flights = await getFlightsByDestination();
  let sortedFlights;
  if (value === "Cheapest") {
    sortedFlights = flights.sort((a, b) => {
      return a.price - b.price;
    });
    createFlightsCards(sortedFlights);
  } else if (value == "Most Expensive") {
    sortedFlights = flights.sort((a, b) => {
      return b.price - a.price;
    });
    createFlightsCards(sortedFlights);
  } else if (value === "Earliest") {
    sortedFlights = flights.sort((a, b) => {
      return a.departureDate - b.departureDate;
    });
    createFlightsCards(sortedFlights);
  } else {
    sortedFlights = flights;
    createFlightsCards(sortedFlights);
  }
}

async function searchFlights(
  fromCity,
  toCity,
  depDate,
  returnDate,
  passengers,
  cabinClass,
  tripType,
) {
  const allFlights = await getFlights();

  const filteredFlights = allFlights.filter((flight) => {
    return (
      flight.cityFrom === fromCity &&
      flight.cityDestination === toCity &&
      flight.departureDate === depDate
    );
  });

  const availableOutbound = filteredFlights.filter((flight) =>
    isAvailable(flight, cabinClass, passengers),
  );

  if (tripType === "one-way") {
    return { outbound: availableOutbound, return: null };
  }

  const returnFlights = allFlights.filter((flight) => {
    return (
      flight.cityFrom === toCity &&
      flight.cityDestination === fromCity &&
      flight.departureDate === returnDate
    );
  });

  const availableReturn = returnFlights.filter((flight) =>
    isAvailable(flight, cabinClass, passengers),
  );

  return { outbound: availableOutbound, return: availableReturn };
}
destCity();
createFlightsCards();
form.addEventListener("submit", handleFilters);
form.addEventListener("reset", async () => {
  await createFlightsCards();
  form.getElementsByTagName("span")[0].innerText = `170$- 1000$`;
  priceRange.value = 1000;
});

priceRange.addEventListener("input", () => {
  const spanPrice = form.getElementsByTagName("span")[0];
  spanPrice.innerText = `170$ - ${priceRange.value} $`;
});

window.addEventListener("load", () => {
  priceRange.value = 1000;
});
const filteredDestinations = await getFlightsByDestination();
airlines(filteredDestinations);
window.addEventListener("load", async () => {
  const fromCity = localStorage.getItem("fromCity");
  const toCity = localStorage.getItem("toCity");
  const depDate = localStorage.getItem("depDate");
  const returnDate = localStorage.getItem("returnDate") || " ";
  const passengers = localStorage.getItem("passengers");
  const cabinClass = localStorage.getItem("cabin");
  const tripType = returnDate === " " ? "one-way" : "round-trip";
  if (fromCity && toCity && depDate && passengers && cabinClass) {
    const flights = await searchFlights(
      fromCity,
      toCity,
      depDate,
      returnDate,
      passengers,
      cabinClass,
      tripType,
    );
    const all =
      flights.return != null
        ? [...flights.outbound, ...flights.return]
        : flights.outbound;
    createFlightsCards(all);
  }
});

const sortSelect = document.getElementsByClassName("sort")[0];
sortSelect.addEventListener("change", function () {
  sortCards(sortSelect.value);
});
