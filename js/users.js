const url = "http://localhost:4000/users";
export async function addUser(user) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
        nationality: "",
        passport: "",
        dateOfBirth: "",
        profilePicture: "",
        flights: [],
      }),
    });

    if (!res.ok) {
      throw new Error(`error ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function getUsers() {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`error ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
