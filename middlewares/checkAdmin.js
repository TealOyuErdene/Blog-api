const jwt = require("jsonwebtoken");
const { User } = require("../routes/userController");

const checkAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET_KEY, async function (err, decoded) {
    if (err) {
      res.sendStatus(401);
    } else {
      const { userId } = decoded;
      const user = await User.findById(userId);

      if (user && user.role === "admin") {
        next();
      } else {
        res.sendStatus(403);
      }
    }
  });
};

module.exports = {
  checkAdmin,
};
