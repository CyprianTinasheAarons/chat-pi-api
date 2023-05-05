module.exports = (app) => {
  const winners = require("../controllers/winner.controller.js");

  let router = require("express").Router();

  // Create a new Winner
  router.post("/", winners.create);

  // Retrieve all Winners
  router.get("/", winners.findAll);

  // Retrieve a single Winner with id
  router.get("/:id", winners.findOne);

  // Update a Winner with id
  router.put("/:id", winners.update);

  // Delete a Winner with id
  router.delete("/:id", winners.delete);

  // Create a new Winner
  router.delete("/", winners.deleteAll);

  app.use("/api/winners", router);
};
