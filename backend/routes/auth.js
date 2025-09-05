function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Auth required");
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "secret");
    next();
  } catch { res.status(401).send("Invalid token"); }
}
