module.exports = (app) => {
  const draws = require("../controllers/draw.controller.js");

  let router = require("express").Router();

  // Create a new Draw
  router.post("/", draws.create);

  // Retrieve all Draws
  router.get("/", draws.findAll);

  // Retrieve a single Draw with id
  router.get("/:id", draws.findOne);

  // Update a Draw with id
  router.put("/:id", draws.update);

  //update draw order
  router.put("/draw/order", draws.updateOrder);

  // Delete a Draw with id
  router.delete("/:id", draws.delete);

  // Create a new Draw
  router.delete("/", draws.deleteAll);

  app.use("/api/draws", router);
};
