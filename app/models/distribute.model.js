module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      txHash: String,
      to: String,
      from: String,
      amount: Number,
      status: String,
      note: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Distribute = mongoose.model("distribute", schema);
  return Distribute;
};
