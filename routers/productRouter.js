const express = require("express");
const upload = require("../app").upload;
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/upload", upload.single("file"), productController.upload);
router.post("/search", productController.searchProduct);
router.get("/categories", productController.categories);
router.post("/", productController.create);
router.get("/", productController.getAll);
router.delete("/", productController.deleteAll);
router.delete("/:id", productController.deleteOne);
router.get("/:id", productController.getOne);
router.put("/:id", productController.updateOne);
router.get("/category/:category", productController.getByCategory);

module.exports = router;
