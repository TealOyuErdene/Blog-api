require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");
const multer = require("multer");
const { categoryRouter } = require("./routes/categoryController");
const { articleRouter } = require("./routes/articleController");
const cloudinary = require("cloudinary");
const { userRouter } = require("./routes/userController");
const { checkAuth } = require("./middlewares/checkAuth");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = 8000;
const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/");
  },

  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    cb(null, `${uuid()}.${extension}`);
  },
});

const upload = multer({
  storage: storage,
});

app.use("/uploads", express.static("uploads"));

app.post(
  "/upload-image",
  upload.single("image"),
  async function (req, res, next) {
    const cloudinaryImage = await cloudinary.v2.uploader.upload(req.file.path);

    return res.json({
      path: cloudinaryImage.secure_url,
      width: cloudinaryImage.width,
      height: cloudinaryImage.height,
    });
  }
);

mongoose
  .connect(process.env.MONGODB_STRING)
  .then(() => console.log("Connected!"));

app.use("/categories", checkAuth, categoryRouter);
app.use("/articles", checkAuth, articleRouter);
app.use("/users", userRouter);

app.listen(port, () => {
  console.log("App is listening at port", port);
});
