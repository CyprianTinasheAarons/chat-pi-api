module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      title: String,
      type: String,
      image: String,
      description: String,
      closeDate: Date,
      price: String,
      maxprice: String,
      maxodds: String,
      live: Boolean,
      contractAddress: String,
      dependentContractAddresses: [],
      abi: String,
      dependentAbis: [],
      mintPrice: String,
      question: String,
      answerA: String,
      answerB: String,
      answerC: String,
      answerD: String,
      correctAnswer: String,
      order: Number,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Draw = mongoose.model("draw", schema);
  return Draw;
};
