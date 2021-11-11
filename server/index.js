const { DevApi } = require("@justinkprince/dev-api");

/**
 * Resources is an array of strings that will determine the collections in your API.
 * Each string added will have five methods generated under that resource name.
 * You may add as many resources as you like.
 *
 * E.g., for the string "users", there will be five routes set up.
 * - GET /users - to fetch all the saved users/
 * - GET /users/:userId (where :userId is some value like 42) - to fetch a single user.
 * - POST /users - to create a new user (passing along the data as JSON to the API).
 * - PUT /users/:userID - to update a user (passing along the data as JSON to the API).
 * - DELETE /users/:userID - to delete a single user.
 */
const config = {
  resources: ["users"],
  // This is the file where the data will be saved. Delete the contents to wipe all the data.
  filepath: "./data/app.json",
};

const api = new DevApi(config);
api.listen(3003);
