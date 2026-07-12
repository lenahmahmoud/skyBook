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
      parent.children[0].children.length < 11
        ? parent.children[0]
        : parent.children[1].children.length < 12
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
function calculateTotal(form, index) {
  const cabin = JSON.parse(localStorage.getItem("booked"))[index].class;
  let total = flight.classPrice[cabin];

  if (document.getElementById(`extra-${index}`).checked) {
    total += Number(document.getElementById(`extra-${index}`).value);
  }

  if (document.getElementById(`meal-${index}`).checked) {
    total += Number(document.getElementById(`meal-${index}`).value);
  }

  if (document.getElementById(`insurance-${index}`).checked) {
    total += Number(document.getElementById(`insurance-${index}`).value);
  }

  return total;
}

function saveBookindSummary(form) {
  localStorage.removeItem("summaryBookings")
  const data = new FormData(form);
  const seatNumbers = [...data.entries()]
    .filter(([key]) => key.startsWith("seatNumber"))
    .map(([, val]) => val);
  const ticketPrices = [...data.entries()]
    .filter(([key]) => key.startsWith("ticket"))
    .map(([, val]) => val);
  const classCabins = [...data.entries()]
    .filter(([key]) => key.startsWith("classcabin"))
    .map(([, val]) => val);
  const extraBags = [...data.entries()].filter(([key]) =>
    key.startsWith("baggage"),
  );
  const meals = [...data.entries()].filter(([key]) => key.startsWith("meal"));
  const insurances = [...data.entries()].filter(([key]) =>
    key.startsWith("insurance"),
  );
  const summaryObjects = seatNumbers.map((seat, index) => {
    const bag = extraBags.filter((bag) => {
      return bag[0] === `baggage[${index}]`;
    });

    const meal = meals.filter((meal) => {
      return meal[0] === `meal[${index}]`;
    });

    const insurance = insurances.filter((ins) => {
      return ins[0] === `insurance[${index}]`;
    });
    return {
      seat: seat,
      ticket: ticketPrices[index],
      classCabin: classCabins[index],
      bag: bag[0]?.[1] || " ",
      meal: meal[0]?.[1] || " ",
      insurance: insurance[0]?.[1] || " ",
    };
  });
  localStorage.setItem("summaryBookings", JSON.stringify(summaryObjects));
  window.location.href = `./checkout.html?id=${flightId}`;
}
function asideBar() {
  const aside = document.getElementsByClassName("aside")[0];
  const getBooked = JSON.parse(localStorage.getItem("booked")) || [];
  console.log(getBooked);
  aside.innerHTML = ``;
  if (getBooked.length !== 0) {
    getBooked.forEach((seat, index) => {
      const divCard = document.createElement("div");
      divCard.classList.add(
        ...[
          "bg-white",
          "rounded-lg",
          "p-5",
          "mb-5",
          "flex",
          "flex-col",
          "gap-2",
          "border-1",
          "border-[var(--dusty)]",
        ],
      );
      divCard.innerHTML = `<h3 class="text-xl mb-2">Your Selection<h3>`;
      const info = document.createElement("div");
      const price = document.createElement("div");
      const extras = document.createElement("div");
      const total = document.createElement("div");
      info.classList.add(
        ...[
          "p-2",
          "flex",
          "justify-between",
          "items-center",
          "border-1",
          "rounded-lg",
          "border-[var(--dusty)]",
        ],
      );
      info.innerHTML = `<span class="text-lg">Seat</span> 
      <div class="flex flex-col gap-1">
      <input class="text-3xl w-20 pointer-events-none focus:outline-none focus:ring-0" type="text" name="seatNumber[${index}]" readonly value="${seat.seat}">  
       <input class="text-gray-500 w-20 pointer-events-none focus:outline-none focus:ring-0" readonly value="${seat.class} " name="classcabin[${index}]">
      </div>

`;

      price.classList.add(
        ...["p-2", "flex", "justify-between", "items-center", "rounded-lg"],
      );
      const cabin = seat.class;

      price.innerHTML = `<span class="text-lg">Ticket</span> 
      <div class="flex flex-col gap-1">
      <input class="text-xl w-20 pointer-events-none focus:outline-none focus:ring-0" type="text" name="ticket[${index}]" readonly value="$${flight.classPrice[cabin]}">  
      </div>

`;
      extras.classList.add(
        ...[
          "p-2",
          "flex",
          "flex-col",
          "gap-1",
          "border-1",
          "rounded-lg",
          "border-[var(--dusty)]",
        ],
      );
      extras.innerHTML = `<span class="text-lg">Extras</span> 
<div class="flex justify-between items-center ">

  <div class="mt-2 flex items-center gap-2 flex-2">
    <input id="extra-${index}" type="checkbox" name="baggage[${index}]" value="${flight.priceExtraBags.checkedBag}">  
    <label for="extra-${index}" class="text-gray-700">Extra Baggages</label>
  </div>

  <div class="flex-1 flex  justify-end items-center">
    <span>$${flight.priceExtraBags.checkedBag}</span>
  </div>
</div>

<div class="flex justify-between items-center">

  <div class="mt-2 flex items-center gap-2 flex-2">
    <input id="meal-${index}" type="checkbox" name="meal[${index}]" value="${flight.meal[cabin]}">  
    <label for="meal-${index}" class="text-gray-700">Meal</label>
  </div>

  <div class="flex-1 flex  justify-end items-center">
    <span>$${flight.meal[cabin]}</span>
  </div>
</div>

<div class="flex justify-between items-center">

  <div class="mt-2 flex items-center gap-2 flex-2">
    <input id="insurance-${index}" type="checkbox" name="insurance[${index}]" value="${flight.travelInsurance}">  
    <label for="insurance-${index}" class="text-gray-700">Travel Insurance</label>
  </div>

  <div class="flex-1 flex  justify-end items-center">
    <span>$${flight.travelInsurance}</span>
  </div>
</div>
`;

      total.classList.add(
        ...[
          "p-2",
          "flex",
          "justify-between",
          "items-center",
          "border-1",
          "rounded-lg",
          "border-[var(--dusty)]",
        ],
      );
      total.innerHTML = `<span class="text-lg">Total:</span> 
      <div class="flex flex-col gap-1">
       <span  id="total-${index}"></span>
      </div>

`;

      divCard.appendChild(info);
      divCard.appendChild(price);
      divCard.appendChild(extras);
      divCard.appendChild(total);
      aside.appendChild(divCard);

      const totalSpan = document.getElementById(`total-${index}`);
      const updateTotal = () => {
        totalSpan.innerText = `$${calculateTotal(aside, index)}`;
      };

      updateTotal();

      document
        .getElementById(`meal-${index}`)
        .addEventListener("change", updateTotal);
      document
        .getElementById(`extra-${index}`)
        .addEventListener("change", updateTotal);
      document
        .getElementById(`insurance-${index}`)
        .addEventListener("change", updateTotal);
    });

    const continueBtn = document.createElement("button");
    continueBtn.classList.add(
      "bg-[var(--navy-blue)]",
      "text-white",
      "w-full",
      "p-1",
      "cursor-pointer",
    );
    continueBtn.innerText = "Continue";
    continueBtn.type = "submit";
    aside.appendChild(continueBtn);
    aside.addEventListener("submit", (e) => {
      e.preventDefault();
      saveBookindSummary(aside);
    });
  } else {
    const ready = document.createElement("div");
    ready.classList.add(
      ...[
        "flex",
        "items-center",
        "justify-center",
        "w-full",
        "h-full",
        "flex-col",
        "p-2",
      ],
    );
    ready.innerHTML = `<h2 id="ready" class="text-center p-1 text-2xl font-bold opacity-0">Ready to fly?</h2>
  <p id="ptext" class="text-center mt-3 text-3xl text-[var(--navy-blue)]">
  </p>
  `;
    aside.appendChild(ready);
    document.getElementById("ptext").innerHTML =
      `<i class="fa-solid fa-plane-departure " ></i>
`;
    document
      .getElementById("ready")
      .classList.add(...["animate-[topToBottom_2s_ease_forwards]"]);
    document
      .getElementById("ptext")
      .classList.add(...["animate-[BottomToTop_2s_ease_forwards]"]);
  }
}
await createMainContent();
asideBar();
