module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      refferer: String,
      reffererWalletAddress: String,
      referralCode: String,
      referralLink: String,
      referralPercentage: Number,
      reffererReward: {
        type: Number,
        default: 0,
      },
      reffererCount: { type: Number, default: 0 },
      reffererTotalReward: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const referral = mongoose.model("referral", schema);
  return referral;
};
