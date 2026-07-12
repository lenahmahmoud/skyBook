import { getFlights } from "./flights.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

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

  Array.from(destinations).forEach((destination) => {
    const article = document.createElement("article");
    article.classList.add(
      ...[
        "rounded-2xl",
        "h-[40vh]",
        "text-white",
        "flex",
        "flex-col",
        "group",
        "overflow-hidden",
        "relative",
        "z-40",
        "flex-1",
      ],
    );

    const overlay = document.createElement("div");
    overlay.classList.add(
      ...[
        "top-0",
        "absolute",
        "h-full",
        "w-full",
        "bg-cover",
        "bg-no-repeat",
        "z-0",
        "group-hover:scale-[1.1]",
        "duration-500",
        "ease-in-out",
      ],
    );
    overlay.style.backgroundImage = `url(${destination.cityDestinationPhoto})`;
    article.appendChild(overlay);

    const div = document.createElement("div");
    div.classList.add(...["rounded-lg", "p-2", "z-30"]);
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
        "transition",
        "duration-800",
        "ease-in-out",
        "font-bold",
        "inset-0",
        "absolute",
        "top-[45%]",
      ],
    );
    const linkExplore = document.createElement("button");

    const exploreIcon = document.createElement("span");
    exploreIcon.innerHTML = `<i class="fa-regular fa-circle-right" ></i>`;

    linkExplore.innerText = `explore flights `;
    linkExplore.classList.add(
      ...[
        "bg-white/90",
        "p-2",
        "text-[var(--navy-blue)]",
        "rounded-xl",
        "text-sm",
        "cursor-pointer",
      ],
    );
    linkExplore.type = "button";
    linkExplore.addEventListener("click", () => {
      localStorage.setItem("destination", destination.cityDestination);
      window.location.href = "./explore.html";
    });

    linkExplore.appendChild(exploreIcon);
    divExplore.appendChild(linkExplore);
    article.appendChild(div);
    article.appendChild(divExplore);
    div.appendChild(h3);
    div.appendChild(p);
    destinationsSection.appendChild(article);
  });
}

function handleSearchedCities(e) {
  e.preventDefault();
  const data = new FormData(form);

  const fromCity = data.get("fromCity");
  const toCity = data.get("toCity");
  const depDate = data.get("depDate");
  const returnDate = data.get("returnDate") || " ";
  const passengers = data.get("passengers");
  const cabinClass = data.get("cabin");
  const inputReturn = form.returnDate;

  if (
    fromCity === "" ||
    toCity === "" ||
    depDate === "" ||
    passengers == "" ||
    cabinClass === "" ||
    (!inputReturn.classList.contains("hidden") && returnDate === "")
  ) {
    Swal.fire({
      icon: "warning",
      title: "Please Fill All The Fields",
      showConfirmButton: false,
      timer: 2000,
    });
    return;
  }
  localStorage.setItem(
    "fromCity",
    fromCity.slice(0, 1).toUpperCase() + fromCity.slice(1),
  );
  localStorage.setItem(
    "destination",
    toCity.slice(0, 1).toUpperCase() + toCity.slice(1),
  );
  localStorage.setItem("depDate", depDate);
  localStorage.setItem("returnDate", returnDate);
  localStorage.setItem("passengers", passengers);
  localStorage.setItem("cabinClass", cabinClass);
  window.location.href = "./explore.html";
}
function animationWelcome() {
  const h1 = document.getElementsByClassName("welcome")[0];
  const text = "Your Journey Starts Here";
  text.split("").forEach((letter, index) => {
    const span = document.createElement("span");
    span.innerHTML = letter === " " ? "&nbsp;" : letter;
    span.className =
      " opacity-0 translate-y-4 animate-[fadeIn_.4s_ease_forwards]";
    span.style.animationDelay = `${index * 50}ms`;

    h1.appendChild(span);
  });
}
createDestinationsection();
toggleOneWay();
const form = document.forms[0];
form.addEventListener("submit", handleSearchedCities);
animationWelcome()