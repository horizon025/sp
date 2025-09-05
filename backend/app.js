const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const path = require("path");

const User = require("./models/User");
const Post = require("./models/Post");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/horizonplus", {useNewUrlParser:true, useUnifiedTopology:true});

// Image upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
app.post("/api/upload", upload.single("image"), (req, res) => {
  res.json({ url: "/uploads/" + req.file.filename });
});

// Auth
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  if (await User.findOne({ username })) return res.status(400).send("User exists");
  const user = new User({ username, password: await User.hashPassword(password), role: "user" });
  await user.save();
  res.send("Signup successful");
});
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await User.comparePassword(password, user.password))) return res.status(400).send("Invalid");
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "2d" });
  res.json({ token, role: user.role, username: user.username });
});

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Auth required");
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "secret");
    next();
  } catch { res.status(401).send("Invalid token"); }
}

// Post CRUD
app.post("/api/posts", requireAuth, async (req, res) => {
  const { title, content, image, category, meta, links } = req.body;
  const post = new Post({ title, content, image, category, meta, links, author: req.user.id });
  await post.save();
  res.json(post);
});
app.get("/api/posts", async (req, res) => {
  const { category, q } = req.query;
  let filter = {};
  if(category) filter.category = category;
  if(q) filter.title = new RegExp(q, "i");
  const posts = await Post.find(filter).sort({createdAt:-1}).limit(50);
  res.json(posts);
});

// Analytics (demo)
app.get("/api/analytics", requireAuth, async (req, res) => {
  // In real, aggregate from logs. Here, demo data
  res.json({
    visitors: [120,180,150,200,170,250,300],
    days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    earnings: 132,
    impressions: 2414,
    clicks: 44
  });
});

app.listen(4000, ()=>console.log("Backend running on 4000"));
