const controller = require("../controllers/pi.controller");

module.exports = function (app) {
  const router = require("express").Router();
 
  //create pi
  router.post("/create", controller.createPI);


  app.use("/api/pi", router);
};
