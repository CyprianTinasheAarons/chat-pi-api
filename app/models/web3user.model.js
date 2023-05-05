module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      username: String,
      email: String,
      bio: String,
      links: String,
      twitter: String,
      facebook: String,
      instagram: String,
      discord: String,
      address: String,
      walletAddress: String,
      phoneNumber: String,
      banner: String,
      avatar: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Web3User = mongoose.model("web3user", schema);
  return Web3User;
};
