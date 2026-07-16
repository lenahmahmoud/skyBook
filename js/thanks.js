function receipt() {
  const receipt = document.querySelector(".receipt");
  receipt.textContent = `${
    JSON.parse(localStorage.getItem("confirm-booking")).PNR
  }`;
}
function goHome() {
  location.href = "./index.html";
}
function downloadPDF() {
  generateHtmlReceipt();
  const element = document.querySelector("#receipt-wrapper");
  html2pdf().from(element).save("booking-receipt.pdf");
}
function generateHtmlReceipt() {
  const booking = JSON.parse(localStorage.getItem("confirm-booking"));
  const receiptPage = document.querySelector(".receipt-page");
  const passengers = booking.passengers;
  const passengerInfo = document.querySelector(".passenger-info");

  const arr = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];
  receiptPage.innerHTML = `        <div style="
        background:#ffffff;
        border:1px solid #e5e7eb;
        border-radius:16px;
        box-shadow:0 10px 15px rgba(0,0,0,.08);
        padding:32px;
        margin-bottom:32px;
    ">

            <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            flex-wrap:wrap;
            gap:24px;
        ">

                <div>
                    <h1 style="
                    margin:0;
                    font-size:36px;
                    font-weight:700;
                    color:var(--navy-blue);
                ">
                        Flight Booking Receipt
                    </h1>

                    <p style="
                    margin-top:8px;
                    color:#6b7280;
                    font-size:16px;
                ">
                        Thank you for choosing SkyBook.
                    </p>
                </div>

                <div style="text-align:right;">

                    <p style="margin:0;color:#6b7280;">
                        Booking Reference
                    </p>

                    <p style="
                    margin:8px 0 20px;
                    font-size:22px;
                    font-weight:bold;
                    color:#000;
                ">
                        <span id="pnr"></span>
                    </p>

                    <p style="margin:0;color:#6b7280;">
                        Order ID
                    </p>

                    <p style="
                    margin-top:8px;
                    font-size:18px;
                    font-weight:600;
                    color:#000;
                    word-break:break-all;
                ">
                        <span id="orderId"></span>
                    </p>

                </div>

            </div>

            <div style="
            margin-top:32px;
            border-top:1px solid #e5e7eb;
        "></div>

        </div>`;

  passengers.forEach((passenger, index) => {
    const card = document.createElement("div");
    card.innerHTML = `
<div style="
    background:#ffffff;
    border:1px solid #e5e7eb;
    border-radius:16px;
    box-shadow:0 10px 15px rgba(0,0,0,.08);
    padding:24px;
    margin-bottom:32px;
">

    <div style="
        display:flex;
        align-items:center;
        gap:16px;
        padding-bottom:20px;
        margin-bottom:24px;
        border-bottom:1px solid #e5e7eb;
    ">

        <div style="
            width:56px;
            height:56px;
            border-radius:50%;
            background:var(--navy-blue);
            color:#ffffff;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:20px;
            font-weight:bold;
            flex-shrink:0;
        ">
            ${index + 1}
        </div>

        <div>
            <h2 style="
                margin:0;
                font-size:24px;
                font-weight:700;
                color:var(--navy-blue);
                text-transform:capitalize;
            ">
                Passenger ${arr[index]}
            </h2>

            <p style="
                margin-top:6px;
                color:#6b7280;
                font-size:15px;
            ">
                Passenger Information
            </p>
        </div>

    </div>

    <div style="
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:20px;
    ">

        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
            <p style="margin:0 0 6px;color:#6b7280;font-size:14px;">Title</p>
            <p style="margin:0;font-size:18px;font-weight:600;color:#000;">${passenger[`title[${index}]`]}</p>
        </div>

        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
            <p style="margin:0 0 6px;color:#6b7280;font-size:14px;">First Name</p>
            <p style="margin:0;font-size:18px;font-weight:600;color:#000;">${passenger[`firstname[${index}]`]}</p>
        </div>

        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
            <p style="margin:0 0 6px;color:#6b7280;font-size:14px;">Last Name</p>
            <p style="margin:0;font-size:18px;font-weight:600;color:#000;">${passenger[`lastname[${index}]`]}</p>
        </div>

        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
            <p style="margin:0 0 6px;color:#6b7280;font-size:14px;">Email</p>
            <p style="margin:0;font-size:18px;font-weight:600;color:#000;word-break:break-all;">
                ${passenger[`email[${index}]`]}
            </p>
        </div>

        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
            <p style="margin:0 0 6px;color:#6b7280;font-size:14px;">Phone Number</p>
            <p style="margin:0;font-size:18px;font-weight:600;color:#000;">
                ${passenger[`phone[${index}]`]}
            </p>
        </div>

        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
            <p style="margin:0 0 6px;color:#6b7280;font-size:14px;">Birthdate</p>
            <p style="margin:0;font-size:18px;font-weight:600;color:#000;">
                ${passenger[`birthdate[${index}]`]}
            </p>
        </div>

        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
            <p style="margin:0 0 6px;color:#6b7280;font-size:14px;">Nationality</p>
            <p style="margin:0;font-size:18px;font-weight:600;color:#000;">
                ${passenger[`nationality[${index}]`]}
            </p>
        </div>

        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
            <p style="margin:0 0 6px;color:#6b7280;font-size:14px;">Passport Number</p>
            <p style="margin:0;font-size:18px;font-weight:600;color:#000;word-break:break-all;">
                ${passenger[`passport[${index}]`]}
            </p>
        </div>

        <div style="
            grid-column:1 / span 2;
            border:1px solid #e5e7eb;
            border-radius:12px;
            padding:16px;
        ">
            <p style="margin:0 0 6px;color:#6b7280;font-size:14px;">Passport Expiry</p>
            <p style="margin:0;font-size:18px;font-weight:600;color:#000;">
                ${passenger[`Expiry[${index}]`]}
            </p>
        </div>

    </div>

</div>
`;
    passengerInfo.appendChild(card);
  });
  document.querySelector("#pnr").textContent = booking.PNR;
  document.querySelector("#orderId").textContent = booking.transactionID;
}
document.querySelector("#home").addEventListener("click", () => {
  goHome();
});
receipt();

document.querySelector("#download").addEventListener("click", () => {
  downloadPDF();
});
