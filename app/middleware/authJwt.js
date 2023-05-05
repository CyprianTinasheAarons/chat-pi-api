const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

let verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    req.isAdmin = decoded.role === "admin";
    next();
  });
};

// Sign JWT token with user role
let signToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, config.secret, {
    expiresIn: 86400, // 24 hours
  });
};

const authJwt = {
  verifyToken: verifyToken,
  signToken: signToken,
};

module.exports = authJwt;
