const jwt = require("jsonwebtoken");
const HttpError = require("./HttpError");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  let token;

  try {
    token = req.headers.authorization.split(" ")[1];
    if (!token) {
      const errors = new HttpError("token access failed", 500);
      return next(errors);
    }

    const decodedToen = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userData = {
      _id: decodedToen._id,
      isAdmin: decodedToen.isAdmin,
      name: decodedToen.name,
    };
    next();
  } catch (err) {
    const errors = new HttpError("Invalid token", 500);
    return next(errors);
  }
};
