module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      username: String,
      email: String,
      walletAddress: String,
      custodialWallet: Boolean,
      phoneNumber: String,
      password: String,
      avatar: String,
      bio: String,
      links: String,
      twitter: String,
      facebook: String,
      instagram: String,
      discord: String,
      address: String,
      banner: String,
      role: String,
      currency: String,
      experience: String,
      isVerified: Boolean,
      referred: Boolean,
      referralCode: String,
      emailVerificationToken: String,
      twoFactorSecret: String,
      resetPasswordToken: String,
      resetPasswordExpires: Date,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};
