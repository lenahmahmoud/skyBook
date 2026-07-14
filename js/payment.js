import { addBooking } from "./bookings.js";
function cardNumber() {
  const cardInput = document.querySelector("#cardNumber");

  cardInput.addEventListener("input", () => {
    let digits = cardInput.value.replace(/\D/g, "");
    digits = digits.slice(0, 16);

    const groups = digits.match(/.{1,4}/g) || [];
    cardInput.value = groups.join(" ");
    if (cardInput.value.length === 19) {
      document.querySelector("#expiryDate").focus();
    }
  });
}
function expiryDate() {
  const expiry = document.querySelector("#expiryDate");
  expiry.addEventListener("input", () => {
    let date = expiry.value.replace(/\D/g, "");
    date.slice(0, 4);
    let groups = date.match(/.{1,2}/g) || [];
    expiry.value = groups.join("/");
    if (expiry.value.length === 5) {
      document.querySelector("#cvv").focus();
    }
  });
}
function cvv() {
  const cvv = document.querySelector("#cvv");
  cvv.addEventListener("input", () => {
    let digits = cvv.value.replace(/\D/g, "");
    digits.slice(0, 2);
    cvv.value = digits;

    if (cvv.value.length === 3) {
      document.querySelector("#billingAddress").focus();
    }
  });
}
function total() {
  const booking = JSON.parse(localStorage.getItem("confirm-booking"));
  const tickets = booking.total.reduce((acc, curr) => {
    return acc + curr;
  });
  document.querySelector(".total").innerText = `$${tickets}`;
}
function generateREceipt() {
  const time =  Date.now();
  const randomValue = Math.floor(Math.random() * 100000);
  return `SKY-${time}-${randomValue}`;
}
function handlePay(form) {
  const finalObject = JSON.parse(localStorage.getItem("confirm-booking"));
  const data = new FormData(form);
  const cardName = data.get("cardName");
  const cardNumber = data.get("cardNumber");
  const expDate = data.get("expiryDate");
  const cvv = data.get("cvv");
  const billingAdd = data.get("billingAddress");

  localStorage.setItem(
    "confirm-booking",
    JSON.stringify({
      ...finalObject,
      payment: {
        cardName: cardName,
        cardNumber: cardNumber,
        expDate: expDate,
        cvv: cvv,
        billingAdd: billingAdd,
      },
      receipt: generateREceipt(),
      userid: localStorage.getItem("user-id")? localStorage.getItem("user-id"):""
    }),
  );
  console.log(JSON.parse(localStorage.getItem("confirm-booking")));
}
function updateSeats(){
    
}
cardNumber();
expiryDate();
cvv();
total();
const form = document.querySelector("form");
document.querySelector(".pay").addEventListener("click", async () => {
  handlePay(form);
  await addBooking(JSON.parse(localStorage.getItem("confirm-booking")));

});
