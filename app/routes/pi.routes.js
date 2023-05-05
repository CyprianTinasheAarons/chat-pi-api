const controller = require("../controllers/pi.controller");

module.exports = function (app) {
  const router = require("express").Router();
 
  //create pi
  router.post("/create", controller.createPI);

  //get pi
  router.get("/get/:id", controller.getPITalk);

  app.use("/api/pi", router);
};
