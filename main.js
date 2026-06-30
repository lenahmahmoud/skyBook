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

window.onload = () => {
  toggleOneWay();
};
