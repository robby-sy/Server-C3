const router = require('express').Router()
const csController = require('../controllers/customerController')
const Authentication = require('../middlewares/authenticationCus')

router.post('/register',csController.customerRegister)
router.post('/login',csController.customerLogin)
router.post('/google',csController.customerGoogleSignIn)
router.get('/articles',csController.customerGetArticles)
router.get('/articles/:id',csController.customerGetArticle)

router.use(Authentication)
router.get('/like',csController.customerGetLike)
router.post('/like',csController.customerAddLike)

module.exports=router