import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";
import { getUsers } from "./users.js";
const form = document.forms[0];

function toggleEye() {
  const input = document.getElementsByClassName("password")[0];
  const eye = document.querySelector(".eye");
  eye.addEventListener("click", () => {
    input.type = input.type == "password" ? "text" : "password";
    eye.children[0].classList.toggle("fa-eye");
    eye.children[0].classList.toggle("fa-eye-slash");
  });
}
async function handleSubmit(e) {
  e.preventDefault();
  const data = new FormData(form);
  const users = await getUsers();
  const isFound = users.filter((user) => {
    return user.email === data.get("email");
  });
  if (isFound.length > 0 && isFound[0].password == data.get("password")) {
    await Swal.fire({
      icon: "success",
      title: "Logged In successfully",
      showConfirmButton: false,
      timer: 2000,
    });
    localStorage.setItem("user-id", isFound[0].id);
    window.location.href = "./index.html";
  } else {
    Swal.fire({
      icon: "warning",
      text: "invalid email or password ",
      background: "var(--navy-blue)",
      color: "white",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-xl",
        confirmButton:
          "bg-white text-[#2063A6] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100",
      },
    });
  }
}

form.addEventListener("submit", handleSubmit);
toggleEye();
