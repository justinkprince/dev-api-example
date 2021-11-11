// Most of the DOM elements that will be interacted with.
const userForm = document.getElementById("user-form");
const userListContainer = document.getElementById("user-list-container");
const userList = document.getElementById("user-list");
const userTemplate = document.getElementById("user-template");
const logger = document.getElementById("log");

// An instance of the API helper class.
const api = new Api({
  baseUrl: "http://localhost:3003",
});

// Write messages to our log element
const log = (msg) => {
  logger.prepend(`↳ ${msg}` + "\n");
};

// Clear log button
document.getElementById("clear-log-btn").addEventListener("click", () => {
  logger.innerHTML = "";
});

// Create a single table row populated with user data.
const createUserTableRow = (user) => {
  // Content templates are a convenient way to add complex HTML structures
  // that contain dynamic data to the DOM.
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
  const tr = userTemplate.content.cloneNode(true);
  const td = tr.querySelectorAll("td");

  // Set the first cell to the user ID (truncated down to 6 characters).
  td[0].textContent = `${user.id.slice(0, 6)}...`;
  // Show the full user ID on mouse hover.
  td[0].title = user.id;
  // Set the second cell to the user name.
  td[1].textContent = user.name;
  // Add the user ID as the delete button's ID for convenience later on.
  td[2].querySelector("button").id = user.id;

  return tr;
};

// Create several table rows with a collection of user data.
const createUserTableRows = (users) => {
  // DocumentFragment objects are great for adding several objects
  // to the DOM via iteration. Touching the DOM can be an expensive
  // operation and DocumentFragment objects allow us to add lots of
  // elements to the DOM with one single interaction.
  // https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
  const fragment = new DocumentFragment();

  // Iterate over the provided users argument.
  users.forEach((user) => {
    // Create a row will all the user's data.
    const tr = createUserTableRow(user);
    // Add the user table row to the fragment.
    fragment.appendChild(tr);
  });

  return fragment;
};

// Fetch user data from API and update the user list in the DOM.
const updateUserList = () => {
  api.get("/users").then((response) => {
    const users = response.data;
    const hasUsers = users.length > 0;

    // Only create user table rows if there are users.
    if (hasUsers) {
      // Get a DocumentFragment containing table rows of user data.
      const tr = createUserTableRows(users);
      // Replace all the children of the tbody element with our new user rows.
      userList.replaceChildren(tr);
    }

    log(`Fetched ${users.length} users.`);
    // Set the class that determines if the "no users" message is displayed or not.
    userListContainer.classList.toggle("has-users", hasUsers);
  });
};

// Click listener for deleting users.
// Using event delegation here so we don't have to add a new event handler for
// every new button that is created. The parent listens for events, checks if
// the target is a delete button, and then reacts accordingly.
// https://davidwalsh.name/event-delegate
userList.addEventListener("click", (event) => {
  const target = event.target;
  if (target.className === "delete-btn") {
    const resource = `/users/${target.id}`;
    api.delete(resource).then((response) => console.log(response));
    log(`Delete user with ID: ${target.id}`);
    updateUserList();
  }
});

// Listener for creating new users.
userForm.addEventListener("submit", (event) => {
  // By default, forms reload the page on submit. We want to prevent that.
  event.preventDefault();

  // Get the value of the name field.
  const name = event.target.elements["user-name"].value;

  // Send a POST request with the data to the API.
  api.post("/users", { name }).then((response) => {
    log(`Create new user: ${response.name}`);
    // Update the list of users now that it has changed.
    updateUserList();
  });
  // Clear out the input field of its previous value.
  userForm.reset();
});

// Populate the user list upon page load.
updateUserList();
