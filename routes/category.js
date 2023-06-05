const router = require("express").Router();
const Controller = require("../controllers");

router.get("/", Controller.getCategories);
router.post("/", Controller.createCategory);
router.delete("/:id",Controller.deleteCategory);

module.exports = router