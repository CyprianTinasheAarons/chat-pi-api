const db = require("../models");
const Distribute = db.distribute;

// Create and Save a new Distribute
exports.create = (req, res) => {
  // Create a Distribute
  const distribute = new Distribute(req.body);

  // Save Distribute in the database
  distribute
    .save(distribute)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Distribute.",
      });
    });
};

// Retrieve all Distributes from the database.
exports.findAll = (req, res) => {
  Distribute.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving distributes.",
      });
    });
};

// Delete all Distributes from the database.
exports.deleteAll = (req, res) => {
  Distribute.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Distributes were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all distributes.",
      });
    });
};
