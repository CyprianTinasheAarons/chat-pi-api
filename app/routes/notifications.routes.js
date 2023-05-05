module.exports = (app) => {
  const notifications = require("../controllers/notifications.controller.js");

  let router = require("express").Router();

    // Create a new Notification
    router.post("/", notifications.create);

    // Retrieve all Notifications
    router.get("/", notifications.findAll);

    // Retrieve a single Notification with id
    router.get("/:id", notifications.findOne);

    // Update a Notification with id
    router.put("/:id", notifications.update);

    // Delete a Notification with id
    router.delete("/:id", notifications.delete);


  app.use("/api/notifications", router);
};
