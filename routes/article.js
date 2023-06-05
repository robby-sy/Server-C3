const router = require("express").Router();
const Controller = require("../controllers");
const Authorization = require("../middlewares/authorization");

router.post("/", Controller.createArticle);
router.get("/", Controller.getArticles);
router.get("/:id", Controller.getArticle);
router.delete("/:id", Authorization.user, Controller.deleteArticle);
router.put('/:id',Authorization.user,Controller.editArticle)
router.patch('/:id',Authorization.admin,Controller.modifyArticle)


module.exports = router;
