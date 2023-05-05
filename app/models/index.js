const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./user.model.js")(mongoose);
db.draws = require("./draw.model.js")(mongoose);
db.transactions = require("./transaction.model.js")(mongoose);
db.winners = require("./winner.model.js")(mongoose);
db.web3users = require("./web3user.model.js")(mongoose);
db.nofications = require("./notifications.model.js")(mongoose);
db.distribute = require("./distribute.model.js")(mongoose);
db.airdrop = require("./airdrop.model.js")(mongoose);
db.referral = require("./referral.model.js")(mongoose);

module.exports = db;
