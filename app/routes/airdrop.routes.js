module.exports = (app) => {
  const airdrops = require("../controllers/airdrop.controller.js");
  const authJwt = require("../middleware/authJwt.js");

  let router = require("express").Router();

  // Create a new Airdrop
  router.post("/", authJwt.verifyToken, airdrops.create);

  // Retrieve all Airdrops
  router.get("/", authJwt.verifyToken, airdrops.findAll);

  // Delete all Airdrops
  router.delete("/", authJwt.verifyToken, airdrops.deleteAll);

  app.use("/api/airdrops", router);
};
