const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 4000;
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

app.use(
  cors({
    allowedHeaders: "*",
    allowedMethods: "*",
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = {
  upload: multer({ storage: storage }),
};

// routes
const produtRoute = require("./routers/productRouter");
app.use("/products", produtRoute);

const uri =
  "mongodb+srv://admin:admin@wdc028-course-booking.mgfy3.mongodb.net/?retryWrites=true&w=majority";

const connectDB = () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

connectDB();

app.listen(process.env.PORT || port, () =>
  console.log(`API is now running at port ${process.env.PORT || port}`)
);
