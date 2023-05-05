module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  let router = require("express").Router();

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve a single User with id
  router.get("/:id", users.findOne);

  // Retrieve a single User with username
  router.get("/username/:username", users.findByUsername);

  // Retrieve a single User with email
  router.get("/email/:email", users.findByEmail);

  // Retrieve a single User with wallet
  router.get("/wallet/:wallet", users.findByWallet);

  // Update a User with id
  router.put("/:id", users.update);

  // Update a User with id
  router.put("/user/:id", users.updateUser);

  // Delete a User with id
  router.delete("/:id", users.delete);

  // Create a new User
  router.delete("/", users.deleteAll);

  app.use("/api/users", router);
};
