import { getFlights } from "./flights.js";
function toggleOneWay() {
  const oneWay = document.getElementsByClassName("one-way")[0];
  const roundTrip = document.getElementsByClassName("round-trip")[0];
  const returnDate = document.getElementsByClassName("return")[0];

  toggleHelper(roundTrip, oneWay);

  function toggleHelper(active, inactive) {
    const activeClasses = [
      "border-b",
      "border-b-[var(--navy-blue)]",
      "border-b-[2px]",
      "rounded-sm",
    ];
    active.classList.add(...activeClasses);
    inactive.classList.remove(...activeClasses);
  }
  oneWay.addEventListener("click", () => {
    toggleHelper(oneWay, roundTrip);
    returnDate.classList.add("hidden");
  });
  roundTrip.addEventListener("click", () => {
    toggleHelper(roundTrip, oneWay);
    returnDate.classList.remove("hidden");
  });
}

async function getPopularDestination() {
  const flights = await getFlights();
  const sortedFlights = [...flights].sort((a, b) => {
    return b.seatsBooked - a.seatsBooked;
  });
  const uniqueFlights = sortedFlights.reduce((acc, current) => {
    const existed = acc.some(
      (item) => item.cityDestination == current.cityDestination,
    );

    if (!existed) {
      acc.push(current);
    }
    return acc;
  }, []);
  uniqueFlights.length = 7;

  return uniqueFlights;
}

async function createDestinationsection() {
  const destinations = await getPopularDestination();
  const destinationsSection = document.querySelector(".destinations");
  console.log(Array.from(destinations).map((d) => d));

  Array.from(destinations).forEach((destination) => {
    const article = document.createElement("article");
    article.classList.add(
      ...[
        "rounded-2xl",
        "bg-cover",
        "bg-no-repeat",
        "h-[40vh]",
        "flex-1",
        "text-white",
        "flex",
        "flex-col",
        "gap-10",
        "group"
       
        ,"overflow-hidden"
      ],
    );
    article.style.backgroundImage = `url( ./assets/cities/${destination.cityDestinationPhoto})`;
    const div = document.createElement("div");
    div.classList.add(...["rounded-lg", "w-fit", "p-2"]);
    const h3 = document.createElement("h3");
    h3.textContent = destination.cityDestination;
    h3.classList.add(...["font-bold", "text-xl"]);

    const p = document.createElement("p");
    p.textContent = `From $ ${destination.price}`;
    p.classList.add("text-sm");

    const divExplore = document.createElement("div");
    divExplore.classList.add(
      ...[
        "text-center",
        "opacity-0",
        "group-hover:opacity-100",
        "transition-opacity",
        "duration-300",
        "ease-in-out"
      
      ],
    );
    const linkExplore = document.createElement("a");
    linkExplore.innerText = "explore flights";
    linkExplore.href = "#";

    divExplore.appendChild(linkExplore);

    article.appendChild(div);
    article.appendChild(divExplore);
    div.appendChild(h3);
    div.appendChild(p);

    destinationsSection.appendChild(article);
  });
}
window.onload = () => {
  toggleOneWay();
  createDestinationsection();
};
