const path = require("path");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/Product");

cloudinary.config({
  cloud_name: "dyecs1c3j",
  api_key: "295329147985129",
  api_secret: "EW7fQ5SAdDIjB2PQc5IBpQpMsJY",
});

module.exports = {
  getByCategory: async (req, res) => {
    try {
      if (req.params.category == "all") {
        const result = await Product.find();
        return res.status(200).send(result);
      }
      const result = await Product.find({ category: req.params.category });
      res.status(200).send(result);
    } catch (err) {
      res.send(err);
    }
  },

  upload: async (req, res) => {
    const file = req.file;
    const filePath = path.join(__dirname, "..", file?.path);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (
      !file.mimetype.includes("image/png") &&
      !file.mimetype.includes("image/jpeg") &&
      !file.mimetype.includes("image/jpg")
    ) {
      return res.status(409).json({ mesage: "filetype not allowed" });
    }
    if (file.size > 5000000) {
      return res
        .status(409)
        .json({ message: "file size must be less than 5mb" });
    }
    try {
      const result = await cloudinary.uploader.upload(
        filePath,
        {
          folder: "luxeology",
        },
        function (error, result) {
          if (error) {
            console.log("Error:", error);
          } else {
            console.log("Result:", result);
          }
        }
      );
      const imageUrl = result.secure_url;

      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  create: async (req, res) => {
    const { name, category, sizes, images, colors, description, care } =
      req.body;
    const newProduct = new Product({
      name,
      category,
      sizes,
      images,
      colors,
      description,
      care,
    });
    try {
      if (images.length > 0) {
        const result = await newProduct.save();
        res.status(200).json(result);
      } else {
        res.status(409).json({ message: "please upload image" });
      }
    } catch (err) {
      res.status(409).json(err);
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await Product.find();
      res.status(200).json(result);
    } catch (err) {
      res.status(409).json(err);
    }
  },

  getOne: async (req, res) => {
    try {
      const result = await Product.findById(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(409).json(err);
    }
  },

  updateOne: async (req, res) => {
    const {
      name,
      category,
      sizes,
      colors,
      images,
      description,
      care,
      isAvailable,
    } = req.body;
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        $set: {
          name,
          category,
          sizes,
          colors,
          images,
          description,
          care,
          isAvailable,
        },
      });
      res.status(200).json({ message: "product edited successfully" });
    } catch (err) {
      res.status(409).json({ message: "product does not exist" });
    }
  },

  deleteAll: async (req, res) => {
    try {
      const result = await Product.find().deleteMany();
      res.status(200).json(result);
    } catch (err) {
      res.status(409).json(err);
    }
  },

  deleteOne: async (req, res) => {
    try {
      const result = await Product.findByIdAndDelete(req.params.id);
      if (!result)
        return res.status(409).json({ message: "product does not exist" });

      res.status(200).json(result);
    } catch (err) {
      res.status(409).json(err);
    }
  },
  categories: async (req, res) => {
    try {
      const categories = await Product.distinct("category");
      res.status(200).json({ categories });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
