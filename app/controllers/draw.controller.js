const db = require("../models");
const Draw = db.draws;

// Create and Save a new  Draw
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Draw
  const draw = new Draw(req.body);

  // Save Draw in the database
  draw
    .save(draw)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Draw.",
      });
    });
};

// Retrieve all Draws from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  let condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Draw.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving draws.",
      });
    });
};

// Find a single Draw with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Draw.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Draw with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Draw with id=" + id });
    });
};

// Update a Draw by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Draw.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Draw with id=${id}. Maybe Draw was not found!`,
        });
      } else res.send({ message: "Draw was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Draw with id=" + id,
      });
    });
};

// Delete a Draw with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Draw.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Draw with id=${id}. Maybe Draw was not found!`,
        });
      } else {
        res.send({
          message: "Draw was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Draw with id=" + id,
      });
    });
};

// Delete all Draws from the database.
exports.deleteAll = (req, res) => {
  Draw.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Draws were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all draws.",
      });
    });
};

exports.updateOrder = (req, res) => {
  if (!req.body || !Array.isArray(req.body)) {
    return res.status(400).send({
      message: "Data to update cannot be empty or not an array!",
    });
  }
  const newDrawOrder = req.body;

  async function updateOrderInDB() {
    const promises = newDrawOrder.map((item) => {
      const { id, order } = item;
      return Draw.findByIdAndUpdate(
        id,
        { order: order },
        { useFindAndModify: true }
      );
    });

    try {
      await Promise.all(promises);
      res.send({ message: "Draw order was updated successfully." });
    } catch (err) {
      res.status(500).send({
        message: "Error occurred while updating draw order: " + err,
      });
    }
  }

  updateOrderInDB();
};
