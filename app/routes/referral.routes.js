module.exports = (app) => {
  const referral = require("../controllers/referral.controller.js");
  const verifyreferral = require("../middleware/verifyReferral.js");

  let router = require("express").Router();

  // Register a user as a referrer and generate a referral code and link
  router.post("/", referral.create);

  // Get a referrer data
  router.get("/", referral.get);

  // Get all referrers
  router.get("/referrers/", referral.getAll);

  // Get all referrals by referrer
  router.get("/referrals/", referral.getAllByReferrer);

  // Get all users with referred set to true and the same referral code
  router.get("/referred-users", referral.getReferredUsers);

  // Update referrer
  router.put("/add-reward", referral.updateReward);

  // add a new referral
  router.put(
    "/add-referral",
    verifyreferral.validateReferral,
    referral.addReferral
  );

  // Send reward to referrer
  router.put("/send-reward/", referral.sendReward);

  //update referral percentage
  router.put("/update-referral-percentage", referral.updateReferralPercentage);

  // Delete a referrer
  router.delete("/", referral.delete);

  app.use("/api/referral", router);
};
