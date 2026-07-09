const url = "http://localhost:3000/flights";

export async function getFlights() {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`error ${res.status}`);
    }
    const data =await  res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function getOneFlight(id) {
  try {
    const res = await fetch(`${url}?flightId=${id}`);
    if (!res.ok) {
      throw new Error(`error ${res.status}`);
    }
    const data = await res.json();
    return data[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}
