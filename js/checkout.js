import { getOneFlight } from "./flights.js";
const params = new URLSearchParams(window.location.search);
const flightId = params.get("id");
const bookings = JSON.parse(localStorage.getItem("summaryBookings"));
const { isValidPhoneNumber, parsePhoneNumber } = window.libphonenumber;
function calculateTotal(booking) {
  let total = Number(booking.ticket.split("").slice(1).join(""));

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
function createSpan(text, parent) {
  const span = document.createElement("span");
  const textnode = document.createTextNode(text);
  span.appendChild(textnode);
  span.classList.add("text-red-500", "w-full");
  parent.after(span);
}
function validate(forms) {
  const dialCodeTextMap = {
    "🇪🇬 Egypt +20": "EG",
    "🇬🇧 UK +44": "GB",
    "🇺🇸 USA +1": "US",
    "🇨🇦 Canada +1": "CA",
    "🇫🇷 France +33": "FR",
    "🇩🇪 Germany +49": "DE",
    "🇮🇹 Italy +39": "IT",
    "🇪🇸 Spain +34": "ES",
    "🇵🇹 Portugal +351": "PT",
    "🇳🇱 Netherlands +31": "NL",
    "🇧🇪 Belgium +32": "BE",
    "🇨🇭 Switzerland +41": "CH",
    "🇦🇹 Austria +43": "AT",
    "🇸🇪 Sweden +46": "SE",
    "🇳🇴 Norway +47": "NO",
    "🇩🇰 Denmark +45": "DK",
    "🇫🇮 Finland +358": "FI",
    "🇮🇪 Ireland +353": "IE",
    "🇵🇱 Poland +48": "PL",
    "🇬🇷 Greece +30": "GR",
    "🇹🇷 Turkey +90": "TR",
    "🇷🇺 Russia +7": "RU",
    "🇺🇦 Ukraine +380": "UA",
    "🇸🇦 Saudi Arabia +966": "SA",
    "🇦🇪 UAE +971": "AE",
    "🇶🇦 Qatar +974": "QA",
    "🇰🇼 Kuwait +965": "KW",
    "🇧🇭 Bahrain +973": "BH",
    "🇴🇲 Oman +968": "OM",
    "🇯🇴 Jordan +962": "JO",
    "🇱🇧 Lebanon +961": "LB",
    "🇸🇾 Syria +963": "SY",
    "🇮🇶 Iraq +964": "IQ",
    "🇲🇦 Morocco +212": "MA",
    "🇩🇿 Algeria +213": "DZ",
    "🇹🇳 Tunisia +216": "TN",
    "🇱🇾 Libya +218": "LY",
    "🇸🇩 Sudan +249": "SD",
    "🇮🇳 India +91": "IN",
    "🇵🇰 Pakistan +92": "PK",
    "🇧🇩 Bangladesh +880": "BD",
    "🇨🇳 China +86": "CN",
    "🇯🇵 Japan +81": "JP",
    "🇰🇷 South Korea +82": "KR",
    "🇵🇭 Philippines +63": "PH",
    "🇮🇩 Indonesia +62": "ID",
    "🇲🇾 Malaysia +60": "MY",
    "🇹🇭 Thailand +66": "TH",
    "🇻🇳 Vietnam +84": "VN",
    "🇦🇺 Australia +61": "AU",
    "🇳🇿 New Zealand +64": "NZ",
  };

  Array.from(forms).forEach((form, index) => {
    const email = form.elements[`email[${index}]`];
    email.addEventListener("change", () => {
      const regex = /^[\w.-]+@[\w.-]+\.(com|org)$/;

      if (email.nextElementSibling) {
        email.nextElementSibling.remove();
      }

      if (!regex.test(email.value)) {
        createSpan("invalid email address", email);
      }
    });

    const dialCode = form.elements[`dialCode[${index}]`];
    const phone = form.elements[`phone[${index}]`];

    phone.addEventListener("change", () => {
      if (phone.nextElementSibling) {
        phone.nextElementSibling.remove();
      }

      const countryCode = dialCodeTextMap[dialCode.value]; 
      const isValid = isValidPhoneNumber(phone.value, countryCode);

      if (!isValid) {
        createSpan("invalid phone number", phone);
      }
    });
  });
}

function checkMissingFields(form, index) {
  const title = form.elements[`title[${index}]`];
  const firstname = form.elements[`firstname[${index}]`];
  const lastname = form.elements[`lastname[${index}]`];
  const email = form.elements[`email[${index}]`];
  const phone = form.elements[`phone[${index}]`];
  const birthdate = form.elements[`birthdate[${index}]`];
  const nationality = form.elements[`nationality[${index}]`];
  const passport = form.elements[`passport[${index}]`];
  const expiry = form.elements[`Expiry[${index}]`];

  function checkRequired(input) {
    if (input.nextElementSibling?.innerText === "*required") {
      input.nextElementSibling.remove();
    }
    if (input.value === "") {
      createSpan("*required", input);
      return false;
    }
    return true;
  }

  title.addEventListener("change", () => checkRequired(title));
  firstname.addEventListener("change", () => checkRequired(firstname));
  lastname.addEventListener("change", () => checkRequired(lastname));
  email.addEventListener("change", () => checkRequired(email));
  phone.addEventListener("change", () => checkRequired(phone));
  birthdate.addEventListener("change", () => checkRequired(birthdate));
  nationality.addEventListener("change", () => checkRequired(nationality));
  passport.addEventListener("change", () => checkRequired(passport));
  expiry.addEventListener("change", () => checkRequired(expiry));

  const results = [
    checkRequired(title),
    checkRequired(firstname),
    checkRequired(lastname),
    checkRequired(email),
    checkRequired(phone),
    checkRequired(birthdate),
    checkRequired(nationality),
    checkRequired(passport),
    checkRequired(expiry),
  ];

  return results.every(Boolean);
}
function handleClick(forms) {
  let allValid = true;
  const allData = Array.from(forms).map((form, index) => {
    const formData = new FormData(form);
    const ok = checkMissingFields(form, index);
    if (!ok) {
      allValid = false;
    }
    return Object.fromEntries(formData.entries());
  });

  if (!allValid) {
    return;
  } else {
    const seats = bookings.map((b) => {
      return b.seat;
    });
    const total = bookings.map((t) => {
      return calculateTotal(t);
    });
    const data = {
      flightId: flightId,
      seats: seats,
      total: total,
      passengers: allData,
    };
    localStorage.setItem("confirm-booking", JSON.stringify(data));
    return true;
  }
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
  bookings.forEach((booking, index) => {
    const content = document.createElement("div");
    content.classList.add(
      ...["content", "flex", "mb-15", "border", "border-gray-200", "p-4"],
    );
    const passenger = document.createElement("div");
    passenger.classList.add(...["flex", "passenger", "flex-2"]);
    passenger.innerHTML = `<form class="form-passenger w-full ">
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
                        <div class="mt-5 w-[80%] flex gap-2 items-center">
                        <div class="flex-col flex">
                        <label for="dialCode[${index}]" class="text-gray-500">Dial Code</label>
<div class="flex-1">
  <input 
    list="dialCodeList[${index}]" 
    id="dialCode[${index}]" 
    name="dialCode[${index}]" 
    required 
    placeholder="Search country code"
    class="p-1 outline outline-gray-400 focus:outline-gray-400 rounded-lg w-ful placeholder:text-black"
  />
  <datalist id="dialCodeList[${index}]">
    <option value="🇪🇬 Egypt +20">
    <option value="🇬🇧 UK +44">
    <option value="🇺🇸 USA +1">
    <option value="🇨🇦 Canada +1">
    <option value="🇫🇷 France +33">
    <option value="🇩🇪 Germany +49">
    <option value="🇮🇹 Italy +39">
    <option value="🇪🇸 Spain +34">
    <option value="🇵🇹 Portugal +351">
    <option value="🇳🇱 Netherlands +31">
    <option value="🇧🇪 Belgium +32">
    <option value="🇨🇭 Switzerland +41">
    <option value="🇦🇹 Austria +43">
    <option value="🇸🇪 Sweden +46">
    <option value="🇳🇴 Norway +47">
    <option value="🇩🇰 Denmark +45">
    <option value="🇫🇮 Finland +358">
    <option value="🇮🇪 Ireland +353">
    <option value="🇵🇱 Poland +48">
    <option value="🇬🇷 Greece +30">
    <option value="🇹🇷 Turkey +90">
    <option value="🇷🇺 Russia +7">
    <option value="🇺🇦 Ukraine +380">
    <option value="🇸🇦 Saudi Arabia +966">
    <option value="🇦🇪 UAE +971">
    <option value="🇶🇦 Qatar +974">
    <option value="🇰🇼 Kuwait +965">
    <option value="🇧🇭 Bahrain +973">
    <option value="🇴🇲 Oman +968">
    <option value="🇯🇴 Jordan +962">
    <option value="🇱🇧 Lebanon +961">
    <option value="🇸🇾 Syria +963">
    <option value="🇮🇶 Iraq +964">
    <option value="🇲🇦 Morocco +212">
    <option value="🇩🇿 Algeria +213">
    <option value="🇹🇳 Tunisia +216">
    <option value="🇱🇾 Libya +218">
    <option value="🇸🇩 Sudan +249">
    <option value="🇮🇳 India +91">
    <option value="🇵🇰 Pakistan +92">
    <option value="🇧🇩 Bangladesh +880">
    <option value="🇨🇳 China +86">
    <option value="🇯🇵 Japan +81">
    <option value="🇰🇷 South Korea +82">
    <option value="🇵🇭 Philippines +63">
    <option value="🇮🇩 Indonesia +62">
    <option value="🇲🇾 Malaysia +60">
    <option value="🇹🇭 Thailand +66">
    <option value="🇻🇳 Vietnam +84">
    <option value="🇦🇺 Australia +61">
    <option value="🇳🇿 New Zealand +64">
  </datalist>
</div>
                        </div>
                            <div class="flex-col flex flex-3">
                                <label for="phone[${index}]" class="text-gray-500">Phone Number</label>
                                <input type="text" name="phone[${index}]" id="phone[${index}]"
                                    placeholder="enter your phone"
                                    class="p-1 outline  outline-gray-400 focus:outline-gray-400 placeholder:text-black rounded-lg w-full">

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
            <span>$ ${booking.insurance === " " ? "---" : booking.insurance}</span>
        </div>

       
        
    </div>
</div>
    
 <div class="flex justify-between mt-10 ">
            <h3>Total Price </h3>
            <span class="text-xl">$ ${calculateTotal(booking)}</span>
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

  const forms = document.getElementsByClassName("form-passenger");
  validate(forms);
  confirm.innerText = "Confirm";
  confirm.type = "button";
  wrap.appendChild(confirm);
  confirm.addEventListener("click", () => {
    handleClick(forms);
    if (handleClick(forms)) {
      location.href = "./payment.html";
    }
  });
}
await createContent();
