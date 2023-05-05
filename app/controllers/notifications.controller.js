const db = require("../models");
const Notification = db.notifications;

// Create and Save a new Notification
exports.create = (req, res) => {
    // Validate request
    if (!req.body.message) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    
    // Create a Notification
    const notification = new Notification(req.body);
    
    // Save Notification in the database
    notification
        .save(notification)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Notification."
        });
        });
};

// Retrieve all Notifications from the database.
exports.findAll = (req, res) => {

    Notification.find()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving notifications."
        });
    });
};

// Find a single Notification with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Notification.findById(id)
    .then(data => {
        if (!data)
        res.status(404).send({ message: "Not found Notification with id " + id });
        else res.send(data);
    })
    .catch(err => {
        res
        .status(500)
        .send({ message: "Error retrieving Notification with id=" + id });
    });
}

// Update a Notification by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Notification.update(id, req.body)
    .then(data => {
        if (!data) {
        res.status(404).send({
            message: `Cannot update Notification with id=${id}. Maybe Notification was not found!`
        });
        } else res.send({ message: "Notification was updated successfully." });
    })
    .catch(err => {
        res.status(500).send({
        message: "Error updating Notification with id=" + id
        });
    });
}

// Delete a Notification with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Notification.findByIdAndRemove(id)
    .then(data => {
        if (!data) {
        res.status(404).send({
            message: `Cannot delete Notification with id=${id}. Maybe Notification was not found!`
        });
        } else {
        res.send({
            message: "Notification was deleted successfully!"
        });
        }
    })
    .catch(err => {
        res.status(500).send({
        message: "Could not delete Notification with id=" + id
        });
    });
}

// Delete all Notifications from the database.
exports.deleteAll = (req, res) => {
    Notification.deleteMany({})
    .then(data => {
        res.send({
        message: `${data.deletedCount} Notifications were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all notifications."
        });
    });
}

