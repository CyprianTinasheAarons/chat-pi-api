const db = require("../models");
const Referral = db.referral;
const User = db.users;

// Helper function to generate a referral code
const generateReferralCode = () => {
  const length = 8;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
};

// Helper function to generate a referral link
const generateReferralLink = (referralCode, userId) => {
  return `http://localhost:3002/register?code=${referralCode}&userId=${userId}`;
};

// Register a user as a referrer and generate a referral code and link
exports.create = async (req, res) => {
  const { refferer, walletAddress } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(refferer);

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Check if user is already a referrer
    const referral = await Referral.findOne({ refferer: refferer });

    if (referral) {
      return res.status(400).json({ msg: "User is already a referrer" });
    }

    // Generate referral code and link
    const referralCode = generateReferralCode();
    const referralLink = generateReferralLink(referralCode, refferer);

    // Create new referral document
    const newReferral = new Referral({
      refferer: refferer,
      reffererWalletAddress: walletAddress,
      referralCode,
      referralLink,
      referralPercentage: 0,
      reffererReward: 0,
      reffererTotalReward: 0,
      reffererCount: 0,
    });

    await newReferral.save();

    res.status(201).json(newReferral);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Get a referrer data
exports.get = async (req, res) => {
  const id = req.body.userId;

  try {
    const referral = await Referral.findOne({ referrer: id });

    if (!referral) {
      return res.status(400).json({ msg: "Referrer not found" });
    }

    res.status(200).json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Get all referrals
exports.getAll = async (req, res) => {
  try {
    const referrals = await Referral.find();

    res.status(200).json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Get all referrals by referrer
exports.getAllByReferrer = async (req, res) => {
  const id = req.body.userId;

  try {
    const referrals = await Referral.find({ referrer: id });

    res.status(200).json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Get all users with referred set to true and the same referral code
exports.getReferredUsers = async (req, res) => {
  const { referralCode } = req.body;

  try {
    const users = await User.find({ referred: true, referralCode });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Update a referrer data
exports.updateReward = async (req, res) => {
  const { referralCode, mintValue } = req.body;

  try {
    const referral = await Referral.findOne({ referralCode: referralCode });
    //using referralPercentage to calculate the reward amount
    const calTotalReward = (referralPercentage / 100) * mintValue;

    if (!referral) {
      return res.status(400).json({ msg: "Referrer not found" });
    }

    referral.reffererReward = referral.reffererReward + calTotalReward;

    await referral.save();

    res.status(200).json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

//update referral percentage for all referrals
exports.updateReferralPercentage = async (req, res) => {
  const { referralPercentage } = req.body;

  try {
    const referrals = await Referral.find();

    if (!referrals) {
      return res.status(400).json({ msg: "Referrals not found" });
    }

    referrals.forEach(async (referral) => {
      referral.referralPercentage = referralPercentage;
      await referral.save();
    });

    res.status(200).json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// add a new referral
exports.addReferral = async (req, res) => {
  const { email, userId, reffererReward } = req.body;

  try {
    const referral = await Referral.findOne({ referrer: userId });

    if (!referral) {
      return res.status(400).json({ msg: "Referrer not found" });
    }

    await Referral.findByIdAndUpdate(
      referral.id,
      {
        reffererReward: reffererReward,
        reffererTotalReward: referral.reffererTotalReward + reffererReward,
        reffererCount: referral.reffererCount + 1,
      },
      { useFindAndModify: false }
    );

    // Update user referred and referralCode fields
    const user = await User.findOne({ email: email });

    await User.findByIdAndUpdate(
      user.id,
      {
        referred: true,
        referralCode: referral.referralCode,
      },
      {
        useFindAndModify: false,
      }
    );

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    res.status(200).json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Send reward to referrer
exports.sendReward = async (req, res) => {
  const id = req.body.userId;

  try {
    const referral = await Referral.findOne({ referrer: id });

    if (!referral) {
      return res.status(400).json({ msg: "Referrer not found" });
    }

    if (referral.referrerReward === 0) {
      return res
        .status(400)
        .json({ msg: "Referrer has already been rewarded" });
    }

    // Distribute reward to referrer here (e.g. transfer funds to their wallet)

    // Update referral document
    referral.referrerTotalReward += referral.referrerReward;
    referral.referrerReward = 0;

    await referral.save();

    res.status(200).json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Delete a referrer
exports.delete = async (req, res) => {
  const id = req.body.id;

  try {
    const referral = await Referral.findOne({ id: id });

    if (!referral) {
      return res.status(400).json({ msg: "Referrer not found" });
    }

    await referral.remove();

    res.status(200).json({ msg: "Referrer deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
