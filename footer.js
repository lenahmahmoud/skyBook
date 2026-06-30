fetch("components/footer.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed TO Load Footer");
    }
   return res.text();
  })
  .then((data) => {
    document.getElementsByClassName("footer")[0].innerHTML = data;
  })
  .catch((err) => {
    console.log(err);
  });
