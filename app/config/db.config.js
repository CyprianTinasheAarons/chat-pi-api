const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  url: isProduction
    ? "mongodb+srv://dbAdmin:WgdwEX8beVvC8MgP@cluster0.h930z.mongodb.net/?retryWrites=true&w=majority"
    : "mongodb://localhost:27017/chat-pi",
};
