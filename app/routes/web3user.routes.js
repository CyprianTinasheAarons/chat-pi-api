module.exports = app => {
  const web3users = require("../controllers/web3user.controller.js");

  let router = require("express").Router();

  // Create a new User
  router.post("/", web3users.create);

  // Retrieve all Users
  router.get("/", web3users.findAll);

  // Retrieve a single User with id
  router.get("/:id", web3users.findOne);

  // Update a User with id
  router.put("/:id", web3users.update);

  // Delete a User with id
  router.delete("/:id", web3users.delete);

  // Create a new User
  router.delete("/", web3users.deleteAll);

  app.use("/api/web3users", router);
};
