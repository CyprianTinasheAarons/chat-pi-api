const db = require("../models");
const Web3User = db.web3users;

// Create and Save a new Web3User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.walletAddress) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    
    // Create a Web3User
    const web3user = new Web3User({
        username: req.body.username,
        email: req.body.email,
        bio: req.body.bio,
        links: req.body.links,
        twitter: req.body.twitter,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        discord: req.body.discord,
        address: req.body.address,
        walletAddress: req.body.walletAddress,
        phoneNumber: req.body.phoneNumber,
        banner: req.body.banner,
        avatar: req.body.avatar,
    });
    
    // Save Web3User in the database
    web3user
        .save(web3user)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Web3User."
        });
        });
    }

// Retrieve all Web3Users from the database.
exports.findAll = (req, res) => {
 
    Web3User.find()
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving web3users."
        });
        });
    }

// Find a single Web3User with an walletAddress
exports.findOne = (req, res) => {
    const walletAddress = req.params.id;
    
    Web3User.findOne({ walletAddress: walletAddress })
        .then(data => {
        if (!data)
            res.status(404).send({ message: "Not found Web3User with walletAddress " + walletAddress });
        else res.send(data);
        })
        .catch(err => {
        res
            .status(500)
            .send({ message: "Error retrieving Web3User with walletAddress=" + walletAddress });
        });
    }

// Update a Web3User by the walletAddress in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Data to update can not be empty!"
        });
    }
    
    const walletAddress = req.params.id;
    
    Web3User.findOne({ walletAddress: walletAddress })
        .then(data => {
        if (!data) {
            res.status(404).send({
            message: `Cannot update Web3User with walletAddress=${walletAddress}. Maybe Web3User was not found!`
            });
        } else {
            data.username = req.body.username;
            data.email = req.body.email;
            data.bio = req.body.bio;
            data.links = req.body.links;
            data.twitter = req.body.twitter;
            data.facebook = req.body.facebook;
            data.instagram = req.body.instagram;
            data.discord = req.body.discord;
            data.address = req.body.address;
            data.walletAddress = req.body.walletAddress;
            data.phoneNumber = req.body.phoneNumber;
            data.banner = req.body.banner;
            data.avatar = req.body.avatar;
            
            data
            .save(data)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                message: "Error updating Web3User with walletAddress=" + walletAddress
                });
            });
        }
        })
        .catch(err => {
        res.status(500).send({
            message: "Error updating Web3User with walletAddress=" + walletAddress
        });
        });
    }

// Delete a Web3User with the specified walletAddress in the request
exports.delete = (req, res) => {
    const walletAddress = req.params.walletAddress;
    
    Web3User.findOne({ walletAddress: walletAddress })
        .then(data => {
        if (!data) {
            res.status(404).send({
            message: `Cannot delete Web3User with walletAddress=${walletAddress}. Maybe Web3User was not found!`
            });
        } else {
            data
            .remove()
            .then(data => {
                res.send({
                message: "Web3User was deleted successfully!"
                });
            })
            .catch(err => {
                res.status(500).send({
                message: "Could not delete Web3User with walletAddress=" + walletAddress
                });
            });
        }
        })
        .catch(err => {
        res.status(500).send({
            message: "Could not delete Web3User with walletAddress=" + walletAddress
        });
        });
    }

// Delete all Web3Users from the database.
exports.deleteAll = (req, res) => {
    Web3User.deleteMany({})
        .then(data => {
        res.send({
            message: `${data.deletedCount} Web3Users were deleted successfully!`
        });
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while removing all web3users."
        });
        });
    }



 



