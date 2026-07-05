import { getFlights } from "./flights.js";

async function getFlightsByDestination() {
  const destinations = await getFlights();

  const filteredDestinations = destinations.filter((des) => {
    return des.cityDestination === localStorage.getItem("destination");
  });
  return filteredDestinations;
}
async function searchResults() {
  const des = await getFlightsByDestination();
  const span = document.getElementsByClassName("search-res")[0];
  span.innerHTML = `${des.length} Found`;
}
function destCity(){
    const span= document.getElementsByClassName('dest-city')[0];
    span.innerHTML=localStorage.getItem("destination")
}


async function createFlightsCards() {
  const contentDiv = document.getElementsByClassName("content")[0];
  const destFlights = await getFlightsByDestination();
  destFlights.forEach((dest) => {
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
    pDepTime.innerText = `${dest.departureDateTime}`;
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
    arrivalTime.innerHTML = `${dest.arrivalDateTime}`;
    divArrival.appendChild(arrivalTime);

    const arrivalAirport = document.createElement("p");
    arrivalAirport.innerHTML = `${dest.airportDestination}`;
    divArrival.appendChild(arrivalAirport);

    const divPrice = document.createElement("div");
    divPrice.classList.add(...["flex-1", "flex", "flex-col", "items-center","gap-1"]);

    const spanPrice = document.createElement("span");
    spanPrice.innerHTML = `$${dest.price} `;
    spanPrice.classList.add(...["text-2xl"]);

    const seats = document.createElement("span");
    seats.innerHTML = `${dest.seatsAvailable} seats left`;
    seats.classList.add(...["text-red-400", "text-sm"]);

    const viewButton = document.createElement("button");
    viewButton.innerText = "View Details";
    viewButton.classList.add(...["bg-[var(--navy-blue)]","p-2","text-sm","rounded-lg","text-white"])

    divPrice.appendChild(spanPrice);
    divPrice.appendChild(seats);
    divPrice.appendChild(viewButton)

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
}

searchResults();
destCity()
createFlightsCards();
