const url = "http://localhost:3000/bookings";

export async function addBooking(object) {
  try {
    const data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        object
      ),
    });
  } catch (err) {
    console.error(err);
  }
}
