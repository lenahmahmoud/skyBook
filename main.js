function toggleOneWay() {
  const oneWay = document.getElementsByClassName("one-way")[0];
  const roundTrip = document.getElementsByClassName("round-trip")[0];
  const returnDate = document.getElementsByClassName("return")[0];
  const dest = document.getElementsByClassName("destination")[0];

  const classArr=["border-b", "border-b-[#2063A6]","border-b-[2px]","rounded-sm"]

  roundTrip.classList.add(
    ...classArr,
  );
  oneWay.addEventListener("click", () => {
    oneWay.classList.add(
      ...classArr,
    );
    roundTrip.classList.remove(
      ...classArr
    );
    dest.classList.add("hidden");
    returnDate.classList.add("hidden");
  });

  roundTrip.addEventListener("click", () => {
    roundTrip.classList.add(
      ...[classArr ],
    );
    oneWay.classList.remove(
      ...[classArr],
    );

    dest.classList.remove("hidden");
    returnDate.classList.remove("hidden");
  });
}

window.onload = () => {
  toggleOneWay();
};
