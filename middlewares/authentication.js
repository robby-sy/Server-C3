const {verifyToken} = require('../helpers/jsonWebToken')
const {Author,Article,Category} = require('../models')

async function Authentication(req,res,next){
    try {
        let {token} = req.headers
        if(!token) throw {name:'Authentication Error'}
        let {authorId} = verifyToken(token)
        let author = await Author.findByPk(authorId)
        if(!author) throw {name:'Authentication Error'}
        req.user = {
            name : author.first_name + ' ' + author.last_name,
            id : author.id,
            role : author.role
        }
        next()
    } catch (error) {
        if(error.name === 'JsonWebTokenError' || error.name === 'Authentication Error'){
            res.status(401).json({message:'Authentication Error'})
        }else{
            res.status(500).json({message:'Internal server Error'})
        }
    }
}

module.exports = Authentication