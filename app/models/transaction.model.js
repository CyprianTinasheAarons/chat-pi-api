module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      contractAddress: String,
      walletAddress: String,
      success: Boolean,
      transactionHash: String,
      PaypalPayment: Boolean,
      PaypalPaymentId: String,
      PaypalPaymentAmount: Number,
      PaypalPaymentCurrency: String,
      PaypalPaymentStatus: String,
      email: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Transaction = mongoose.model("transaction", schema);
  return Transaction;
};
