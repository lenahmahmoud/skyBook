fetch("components/navbar.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed To Load Nav Bar");
    }
    return res.text();
  })
  .then((data) => {
    document.getElementsByClassName("nav")[0].innerHTML = data;
    const id = localStorage.getItem("user-id");
    if (id) {
      const loginDiv = document.querySelector(".login-status");
      loginDiv.innerHTML = ` <a href="#"> <i class="fa-solid fa-circle-user""></i> profile</a>`;
      loginDiv.classList.add(...["flex","gap-2" ,"text-xl"])
    }
  })
  .catch((err) => console.log(err));
