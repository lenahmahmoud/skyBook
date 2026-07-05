import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";
import { addUser, getUsers } from "./users.js";
const form = document.forms[0];

function buttonToggle(check) {
  const btn = document.querySelector(".btn-submit");
  btn.classList.toggle("bg-gray-500");
  btn.classList.toggle("bg-[var(--navy-blue)]");
  btn.disabled = !check.checked;
}
async function makeAlert(text, icon) {
  await Swal.fire({
    icon: icon,
    text: text,
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
async function makeAlertTimer(icon, text) {
  await Swal.fire({
    icon: icon,
    title: text,
    showConfirmButton: false,
    timer: 2000,
  });
}
async function isTheSameEmail(email) {
  try {
    const users = await getUsers();
    return users.filter((user) => user.email === email);
  } catch (err) {
    console.error(err);
  }
}
function togglePasswordType() {
  const inputButtons = document.getElementsByClassName("password");
  const passwordEyes = document.getElementsByClassName("eye");
  Array.from(passwordEyes).map((eye, index) => {
    eye.addEventListener("click", () => {
      inputButtons[index].type =
        inputButtons[index].type === "password" ? "text" : "password";
      eye.children[0].classList.toggle("fa-eye-slash");
      eye.children[0].classList.toggle("fa-eye");
    });
  });
}

async function handleSubmit(e) {
  e.preventDefault();
  console.log("prevented");
  const data = new FormData(form);
  const firstName = data.get("firstname");
  const lastName = data.get("lastname");
  const email = data.get("email");
  const password = data.get("password");
  const confirmPassword = data.get("confirmpassword");
  const TheSameEmail = await isTheSameEmail(email);

  const regepx = /^\w+\.\w+@\w+\.(com|org|net)$/;
  const isValid = regepx.test(email);

  
  if (
    data === "" ||
    firstName === "" ||
    lastName === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    await makeAlert("Please Fill All The Fields", "error");
  } else if (password !== confirmPassword) {
    await makeAlert("Passwords Do Not Match", "warning");
  } else if (password.length < 8) {
    await makeAlertTimer(
      "warning",
      "Password must be at least 8 characters long",
    );
  } else if (TheSameEmail.length > 0) {
    await makeAlert("This Email Is Already Existed", "warning");
  } else if (!isValid) {
    await makeAlert("this email is not valid", "warning");
  } else {
    try {
      const data = await addUser({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });
      if (data) {
        await makeAlertTimer("success", "Account Created Sucessfully");
        localStorage.setItem("user-id", data.id);
        window.location.href = "./index.html";
      }
    } catch (err) {
      console.log(err);
    }
  }
}
window.onload = () => {
  const check = document.getElementById("check");
  buttonToggle(check);
  check.addEventListener("change", () => {
    buttonToggle(check);
  });
  togglePasswordType();
};

form.addEventListener("submit", handleSubmit);
