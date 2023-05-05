module.exports = (app) => {
  const distributes = require("../controllers/distribute.controller.js");
  const authJwt = require("../middleware/authJwt.js");

  let router = require("express").Router();

  //Create a new Distribute
  router.post("/", distributes.create);

  //Retrieve all Distributes
  router.get("/", distributes.findAll);

  //Delete all Distributes
  router.delete("/", distributes.deleteAll);

  app.use("/api/distributes", router);
};
