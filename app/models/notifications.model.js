module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      message: String,
      userId: String,
      read: { type: Boolean, default: false }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Notifications = mongoose.model("notification", schema);
  return Notifications;
};
