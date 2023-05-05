const db = require("../models");
const Referral = db.referral;

// Middleware to prevent bots, prevent repeat entries, and ensure unique users
let validateReferral = async (req, res, next) => {
  const { referralCode } = req.body;

  try {
    // Check if referral code is valid
    const referral = await Referral.findOne({ referralCode });

    if (!referral) {
      return res.status(400).json({ msg: "Invalid referral code" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const verifyreferral = {
  validateReferral: validateReferral,
};

module.exports = verifyreferral;
