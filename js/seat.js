import { getOneFlight } from "./flights.js";

const params = new URLSearchParams(window.location.search);
const flightId = params.get("id");
let bookedSeats = [];
let flight;
function createButtons(seats, parent, type) {
  seats = seats.filter((s) => s.class === type);
  const getBooked = JSON.parse(localStorage.getItem("booked")) || [];
  bookedSeats = [...getBooked];
  let seg = 6;
  if (type == "first") {
    seg = 4;
  }
  for (let i = 0; i < seats.length; i += seg) {
    const div =
      parent.children[0].children.length < 12
        ? parent.children[0]
        : parent.children[1].children.length < 13
          ? parent.children[1]
          : parent.children[2];

    const rawSeats = seats.slice(i, i + seg);
    const rawDiv = document.createElement("div");
    rawDiv.classList.add(...["flex", "justify-between", "px-7", "py-2"]);
    const leftDiv = document.createElement("div");
    const rightDiv = document.createElement("div");
    leftDiv.classList.add(...["flex", "gap-2"]);
    rightDiv.classList.add(...["flex", "gap-2"]);

    rawSeats.forEach((seat, index) => {
      const button = document.createElement("button");
      button.textContent = seat.seat
        .split("")
        .filter((char) => isNaN(+char))
        .join("");
      button.disabled = !seat.available;
      button.style.backgroundColor = seat.available ? "#7BF1A8" : "#E5E7EB";
      button.classList.add(...["px-3", "py-1", "rounded-lg", "cursor-pointer"]);

      const alreadyIncluded = getBooked.some((e) => e.seat === seat.seat);

      if (alreadyIncluded) {
        button.style.backgroundColor = "#00BCFF";
        button.dataset.selected = "true";
      }

      button.addEventListener("click", () => {
        const selected = button.dataset.selected === "true";
        button.style.backgroundColor = selected ? "#7BF1A8" : "#00BCFF";

        if (!selected) {
          bookedSeats.push(seat);
        } else {
          const idx = bookedSeats.findIndex((s) => s.seat === seat.seat);
          if (idx !== -1) bookedSeats.splice(idx, 1);
        }

        button.dataset.selected = String(!selected);
        localStorage.setItem("booked", JSON.stringify(bookedSeats));
        console.log(bookedSeats);
        asideBar();
      });

      if (index < seg / 2) {
        leftDiv.appendChild(button);
      } else {
        rightDiv.appendChild(button);
      }
    });

    rawDiv.appendChild(leftDiv);
    rawDiv.appendChild(rightDiv);
    div.appendChild(rawDiv);
  }
}
function handleSeatsButtons(seats) {
  const seatsDiv = document.querySelector(".seats");
  const firstH2 = document.createElement("h2");
  firstH2.innerText = "First class";
  firstH2.classList.add(
    ...[
      "bg-[#C8CEE5]/20",
      "text-center",
      "p-2",
      "text-[var(--navy-blue)]",
      "mb-2",
    ],
  );
  seatsDiv.children[0].appendChild(firstH2);

  createButtons(seats, seatsDiv, "first");
  const businessH2 = document.createElement("h2");
  businessH2.classList.add(
    ...[
      "bg-[#C8CEE5]/20",
      "text-center",
      "p-2",
      "text-[var(--navy-blue)]",
      "mb-4",
      "mt-10",
    ],
  );
  businessH2.innerText = "Business Class";
  seatsDiv.children[0].appendChild(businessH2);
  createButtons(seats, seatsDiv, "business");

  const economyH2 = document.createElement("h2");
  economyH2.classList.add(
    ...[
      "bg-[#C8CEE5]/20",
      "text-center",
      "p-2",
      "text-[var(--navy-blue)]",
      "mb-2",
    ],
  );
  economyH2.innerText = "Economy Class";
  seatsDiv.children[1].appendChild(economyH2);
  createButtons(seats, seatsDiv, "economy");
}
async function createMainContent() {
   flight = await getOneFlight(flightId);
  document.querySelector(".model").innerText = `${flight.aircraft}`;
  handleSeatsButtons(flight.seats);
}
function asideBar() {
  const getBooked = JSON.parse(localStorage.getItem("booked")) || [];
  const info = document.querySelector(".info");
  const price = document.querySelector(".price");
  if (getBooked.length === 0) {
    info.innerText = "---";
    price.innerText="$---"
  } else {
    info.innerHTML = "";
    price.innerHTML=""
    getBooked.forEach((seat) => {
      const seatDiv = document.createElement("div");
    
      const spanONe = document.createElement("span");
      spanONe.innerText = `${seat.seat}`;
      spanONe.classList.add(...["text-2xl"]);
      seatDiv.appendChild(spanONe);
      const spanTwo = document.createElement("p");
      const cabin= seat.class;
      spanTwo.innerText = `$${flight.classPrice[cabin]}`;
      spanTwo.classList.add(...["text-2xl"]);
      info.appendChild(seatDiv);
      price.appendChild(spanTwo)
    });
  }
}
await createMainContent();
asideBar();
