fetch("components/navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementsByClassName("nav")[0].innerHTML = data;
  });
