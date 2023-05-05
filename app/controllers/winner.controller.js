const db = require("../models");
const Winner = db.winners;

// Create and Save a new Winner
exports.create = (req, res) => {
  // Create a Winner
  const winner = new Winner(req.body);

  // Save Winner in the database
  winner
    .save(winner)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Winner.",
      });
    });
};

// Retrieve all Winners from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  let condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Winner.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving winners.",
      });
    });
};

// Find a single Winner with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Winner.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Winner with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Winner with id=" + id });
    });
};

// Update a Winner by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Winner.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Winner with id=${id}. Maybe Winner was not found!`,
        });
      } else res.send({ message: "Winner was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Winner with id=" + id,
      });
    });
};

// Delete a Winner with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Winner.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Winner with id=${id}. Maybe Winner was not found!`,
        });
      } else {
        res.send({
          message: "Winner was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Winner with id=" + id,
      });
    });
};

// Delete all Winners from the database.
exports.deleteAll = (req, res) => {
  Winner.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Winners were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all winners.",
      });
    });
};
