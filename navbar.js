fetch("components/navbar.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed To Load Nav Bar");
    }
    return res.text();
  })
  .then((data) => {
    document.getElementsByClassName("nav")[0].innerHTML = data;
  })
  .catch((err)=>console.log(err))
