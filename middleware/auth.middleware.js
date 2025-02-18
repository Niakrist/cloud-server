import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Не авторизованный пользователь" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    console.log("back token: ", token);

    next();
  } catch (error) {}
  return res.status(401).json({ message: "Не авторизованный пользователь" });
};
