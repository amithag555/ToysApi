const jwt = require("jsonwebtoken");
const { config } = require("../config/secret.js");

exports.userAuth = (req, res, next) => {
  let token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ err_msg: "Need to send token!" });
  }

  try {
    let decodedToken = jwt.verify(token, config.tokenSecretWord);
    req.decodedToken = decodedToken;

    next();
  } catch (err) {
    return res.status(401).json({ err_msg: "Token invalid or expired" });
  }
};
