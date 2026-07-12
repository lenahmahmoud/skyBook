import { getOneFlight } from "./flights.js";
const params = new URLSearchParams(window.location.search);
const flightId = params.get("id");

function calculateTotal(booking) {
  let total = booking.ticket;

  if (booking.bag != " ") {
    total += Number(booking.bag);
  }

  if (booking.meal !== " ") {
    total += Number(booking.meal);
  }

  if (booking.insurance !== " ") {
    total += Number(booking.insurance);
  }

  return total;
}

async function createContent() {
  const passengerNames = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];

  const flight = await getOneFlight(flightId);
  const wrap = document.querySelector(".wrap");
  const bookings = JSON.parse(localStorage.getItem("summaryBookings"));
  bookings.forEach((booking, index) => {
    const content = document.createElement("div");
    content.classList.add(
      ...["content", "flex", "mb-15", "border", "border-gray-200", "p-4"],
    );
    const passenger = document.createElement("div");
    passenger.classList.add(...["flex", "passenger", "flex-2"]);
    passenger.innerHTML = `<form class="form-passenger[${index}] w-full ">
                        <h2 class="text-xl">Passenger ${passengerNames[index]}  Information</h2>
                        <div class="flex  mt-5 gap-4 w-[80%]">
                            <div class="flex-col flex gap-2 flex-1 ">
                                <label for="title[${index}]" class="text-gray-500">Title</label>
                                <select name="title[${index}]" id="title[${index}]"
                                    class="p-1   outline  outline-gray-400 focus:outline-gray-400 cursor-pointer rounded-lg w-full">
                                    <option value="Mrs">Mrs</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Miss">Miss</option>
                                    <option value="Ms">Ms</option>
                                </select>
                            </div>
                            <div class="flex-col flex gap-2 flex-2">
                                <label for="firstname[${index}]" class="text-gray-500">First Name</label>
                                <input type="text" name="firstname[${index}]" id="firstname[${index}]"
                                    placeholder="enter your first name"
                                    class="p-1  outline outline-gray-400 focus:outline-gray-400 placeholder:text-black rounded-lg w-full">

                            </div>
                            <div class="flex-col flex gap-2 flex-2 ">
                                <label for="lastname[${index}]" class="text-gray-500">Last Name</label>
                                <input type="text" name="lastname[${index}]" id="lastname[${index}]"
                                    placeholder="enter your last name"
                                    class="p-1  outline  outline-gray-400 focus:outline-gray-400 text-black placeholder:text-black rounded-lg w-full">

                            </div>

                        </div>
                        <div class="mt-5 w-[80%]">
                            <div class="flex-col flex gap-2 ">
                                <label for="email[${index}]" class="text-gray-500">Email</label>
                                <input type="text" name="email[${index}]" id="email[${index}]"
                                    placeholder="enter your email"
                                    class="p-1  outline  outline-gray-400 focus:outline-gray-400 placeholder:text-black rounded-lg ">

                            </div>

                        </div>
                        <div class="mt-5 w-[80%]">
                            <div class="flex-col flex gap-2 ">
                                <label for="phone[${index}]" class="text-gray-500">Phone Number</label>
                                <input type="text" name="phone[${index}]" id="phone[${index}]"
                                    placeholder="enter your phone"
                                    class="p-1 outline  outline-gray-400 focus:outline-gray-400 placeholder:text-black rounded-lg ">

                            </div>

                        </div>
                        <div class="mt-5 w-[80%] flex  gap-3">
                            <div class="flex-col flex gap-2 flex-1 ">
                                <label for="birthdate[${index}]" class="text-gray-500">Date Of Birth</label>
                                <div class="relative">
                                    <input type="date" name="birthdate[${index}]" id="birthdate[${index}]"
                                        class="p-1  outline w-full outline-gray-400 focus:outline-gray-400 placeholder:text-black rounded-lg ">
                                    <i class="fa-solid fa-calendar absolute top-2 right-2 text-[var(--navy-blue)]"></i>

                                </div>

                            </div>
                            <div class="flex-col flex gap-2  flex-1">
                                <label for="nationality[${index}]" class="text-gray-500">
                                    Nationality
                                </label>

                                <input type="text" list="nationalities" name="nationality[${index}]"
                                    id="nationality[${index}]" placeholder="select nationality"
                                    class="p-1 outline w-full outline-gray-400 focus:outline-gray-400 placeholder:text-black rounded-lg">

                                <datalist id="nationalities">
                                    <option value="Afghan">
                                    <option value="Algerian">
                                    <option value="American">
                                    <option value="Argentinian">
                                    <option value="Australian">
                                    <option value="Austrian">
                                    <option value="Bahraini">
                                    <option value="Bangladeshi">
                                    <option value="Belgian">
                                    <option value="Brazilian">
                                    <option value="British">
                                    <option value="Bulgarian">
                                    <option value="Canadian">
                                    <option value="Chinese">
                                    <option value="Croatian">
                                    <option value="Czech">
                                    <option value="Danish">
                                    <option value="Dutch">
                                    <option value="Egyptian">
                                    <option value="Emirati">
                                    <option value="Finnish">
                                    <option value="French">
                                    <option value="German">
                                    <option value="Greek">
                                    <option value="Hungarian">
                                    <option value="Indian">
                                    <option value="Indonesian">
                                    <option value="Iranian">
                                    <option value="Iraqi">
                                    <option value="Irish">
                                    <option value="Italian">
                                    <option value="Japanese">
                                    <option value="Jordanian">
                                    <option value="Kenyan">
                                    <option value="Kuwaiti">
                                    <option value="Lebanese">
                                    <option value="Libyan">
                                    <option value="Malaysian">
                                    <option value="Mexican">
                                    <option value="Moroccan">
                                    <option value="Nepalese">
                                    <option value="New Zealander">
                                    <option value="Nigerian">
                                    <option value="Norwegian">
                                    <option value="Omani">
                                    <option value="Pakistani">
                                    <option value="Palestinian">
                                    <option value="Philippine">
                                    <option value="Polish">
                                    <option value="Portuguese">
                                    <option value="Qatari">
                                    <option value="Romanian">
                                    <option value="Russian">
                                    <option value="Saudi">
                                    <option value="Singaporean">
                                    <option value="South African">
                                    <option value="South Korean">
                                    <option value="Spanish">
                                    <option value="Sri Lankan">
                                    <option value="Sudanese">
                                    <option value="Swedish">
                                    <option value="Swiss">
                                    <option value="Syrian">
                                    <option value="Thai">
                                    <option value="Tunisian">
                                    <option value="Turkish">
                                    <option value="Ukrainian">
                                    <option value="Emirati">
                                    <option value="Vietnamese">
                                    <option value="Yemeni">
                                </datalist>

                            </div>

                        </div>
                        <div class="mt-5 w-[80%] flex gap-3">
                            <div class="flex-col flex gap-2 flex-1 ">
                                <label for="passport[${index}]" class="text-gray-500">Passport Number</label>
                                <input type="text" name="passport[${index}]" id="passport[${index}]"
                                    placeholder="enter your passport number"
                                    class="p-1  outline w-full outline-gray-400 focus:outline-gray-400 placeholder:text-black rounded-lg ">

                            </div>
                            <div class="flex-col flex gap-2  flex-1">

                                <label for="Expiry[${index}]" class="text-gray-500">Expiry Date</label>
                                <div class="relative">
                                    <input type="date" name="Expiry[${index}]" id="Expiry[${index}]"
                                        class="p-1  outline w-full outline-gray-400 focus:outline-gray-400 placeholder:text-black rounded-lg ">
                                    <i class="fa-solid fa-calendar absolute top-2 right-2 text-[var(--navy-blue)]"></i>

                                </div>


                            </div>

                        </div>

                    </form>`;
    content.appendChild(passenger);

    const summary = document.createElement("div");
    summary.classList.add(...["flex-1", "summary", "shadow-lg/10", "p-3"]);
    summary.innerHTML = `
                    <h2 class="mb-3 text-xl">Booking Summary</h2>

    <div class="flex gap-5 items-center p-3">
    <div
        class="logo flex justify-center items-center size-15 outline outline-gray-400 shadow-lg/8 p-1">
        <img src="${flight.logoimage}" alt="flight.logoimage" class="size-13">
    </div>
    <div class="info-flight">
        <p>${flight.airline} ${flight.aircraft}</p>
        <p class="text-gray-500">${flight.airportDeparture} - ${flight.airportDestination}</p>
        <p class="text-gray-500">
            ${flight.departureDate} - ${flight.departureClock} - ${flight.arrivalClock}
        </p>
    </div>
</div>

<div class="flex justify-between my-4">
    <h3>Seat</h3>
    <span class="text-gray-500">${booking.seat} - ${booking.classCabin}</span>
</div>

<div>
    <h3>Extras</h3>
    <div class="p-3">
        <div class="flex justify-between mb-3 border-b border-gray-500">
            <h3>Meal</h3>
            <span>$ ${booking.meal === " " ? "---" : booking.meal}</span>
        </div>
        <div class="flex justify-between mb-3 border-b border-gray-500">
            <h3>Extra Bags</h3>
            <span>$ ${booking.bag === " " ? "---" : booking.bag}</span>
        </div>
        <div class="flex justify-between mb-3 border-b border-gray-500">
            <h3>Travel Insurance</h3>
            <span>$ ${booking.insurance === " " ? "$---" : booking.insurance}</span>
        </div>

       
        
    </div>
</div>
    
 <div class="flex justify-between mt-10 ">
            <h3>Total Price </h3>
            <span class="text-xl"> ${calculateTotal(booking)}</span>
        </div>
       
                
`;

    content.appendChild(summary);
    wrap.appendChild(content);
  });

  const confirm = document.createElement("button");
  confirm.classList.add(
    ...["bg-[#2063A6]", "w-full", "p-2", "text-white"],
    "cursor-pointer",
  );

  confirm.innerText = "Pay Now";
  wrap.appendChild(confirm);
}
await createContent();
