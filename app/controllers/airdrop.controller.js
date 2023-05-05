const db = require("../models");
const Airdrop = db.airdrop;

const isAdmin = (req, res, next) => {
  if (req.isAdmin) {
    next();
    return;
  }
  res.status(403).send({ message: "Require Admin Role!" });
  return;
};

// Create and Save a new Airdrop
exports.create = [
  isAdmin,
  (req, res) => {
    // Validate request

    // Create a Airdrop
    const airdrop = new Airdrop(req.body);

    // Save Airdrop in the database
    airdrop
      .save(airdrop)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Airdrop.",
        });
      });
  },
];

// Retrieve all Airdrops from the database.
exports.findAll = [
  isAdmin,
  (req, res) => {
    Airdrop.find()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving airdrops.",
        });
      });
  },
];

// Delete all Airdrops from the database.
exports.deleteAll = [
  isAdmin,
  (req, res) => {
    Airdrop.deleteMany({})
      .then((data) => {
        res.send({
          message: `${data.deletedCount} Airdrops were deleted successfully!`,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all airdrops.",
        });
      });
  },
];
