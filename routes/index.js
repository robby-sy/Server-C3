const router = require('express').Router()
const Controller = require('../controllers')
const Authentication = require('../middlewares/authentication')
const articleRouter = require('./article')
const categoryRouter = require('./category')
const costumerRouter = require('./customer')


router.post('/register',Controller.registerAdmin)
router.post('/login',Controller.login)
router.post('/google-signin',Controller.googleSignIn)
router.use('/pub',costumerRouter)
router.use(Authentication)

router.use('/articles',articleRouter)
router.use('/categories',categoryRouter)
router.get('/histories',Controller.getHistories)

router.use((error,req,res,next)=>{
    let code;
    let message;
    switch (error.name) {
        case 'SequelizeUniqueConstraintError':
            code = 400
            message = 'This email has already been registered'
            break;
        case 'SequelizeValidationError':
            code = 400
            message = []
            error.errors.forEach(element => {
                message.push(element.message)
            });
            break;
        case 'Data not found':
            code = 404
            message = error.name
            break;
        case 'Incorrect email or password':
            code = 400
            message = error.name
            break;
        case 'empty field':
            code = 400
            message = error.message
            break;
        default:
            code = 500
            message = 'Internal server error'
            break;
    }
    res.status(code).json({message})
})

module.exports = router