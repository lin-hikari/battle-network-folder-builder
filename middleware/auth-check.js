const jwt = require("jsonwebtoken");

exports.authCheck = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const err = new Error("Authentication failed!");
    err.statusCode = 401;
    throw err;
  }

  const token = authHeader.split(" ")[1]; //header field = "Bearer <token>"
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const err = new Error("Authentication failed!");
    err.statusCode = 401;
    throw err;
  }
  req.userId = decodedToken.userId;
  next();
};
