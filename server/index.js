const { DevApi } = require("@justinkprince/dev-api");

const config = {
  resources: ["users", "menus", "categories"],
  filepath: "./data/app.json",
};

const api = new DevApi(config);
api.listen(3003);
