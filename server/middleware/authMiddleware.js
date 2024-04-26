import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const Authorization = req.headers.Authorization || req.headers.authorization;

  if (Authorization && Authorization.startsWith("Bearer")) {
    const token = Authorization.split(" ")[1];
    console.log("===========================================token", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      console.log("err", err);
      console.log(user);
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Invalid token" });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "something went wrong!" });
  }
};
