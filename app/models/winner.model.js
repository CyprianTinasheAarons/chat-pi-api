module.exports = mongoose => {
  let schema = mongoose.Schema(
    {
      name: String,
      email: String,
      address: String,
      price: String,
      date: Date,
      draw: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Winner = mongoose.model("winner", schema);
  return Winner;
};
