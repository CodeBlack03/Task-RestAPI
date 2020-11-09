const jwt = require("jsonwebtoken");
const Users = require("../schema/usersSchema");

const auth = async (req, res, next) => {
  try {
    //console.log(req);
    const token = req.header("Authorization").replace("Bearer ", "");
    //console.log(token.toJSON);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    const user = await Users.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    //console.log(user);
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;

    next();
  } catch (err) {
    //console.log(err);
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
