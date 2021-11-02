const userForm = document.getElementById("user-form");
const log = document.getElementById("log");

const fetchUsers = async () => {
  const users = await fetch("http://localhost:3003/users").then((response) =>
    response.json()
  );

  return users.data;
};

const users = fetchUsers().then((users) => {
  if (users.length > 0) {
    log.innerHTML = JSON.stringify(users, null, 2);
  }
});

userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = event.target.elements["user-name"].value;
  fetch("http://localhost:3003/users", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: username }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      log.innerHTML = JSON.stringify(data, null, 2);
    });
});
