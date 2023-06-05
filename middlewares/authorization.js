const { deleteArticle } = require('../controllers')
const {Author,Article} = require('../models/index')

class Authorization{
    static async user(req,res,next){
        let articleId = req.params.id
        let author = req.user
        try {
            let article = await Article.findByPk(articleId,{
                include:Author
            })
            let authorId = article.Author.id
            if(author.role === 'Admin' || author.id===authorId){
                next()
            }else{
                throw {message:'Authorization Denied'}
            }
        } catch (error) {
            res.status(403).json({error})
        }
    }

    static async admin(req,res,next){
        let {id} = req.params
        let author = req.user
        try {
            if(author.role === 'Admin'){
                next()
            }else{
                throw {message:'Authorization Denied'}
            }
        } catch (error) {
            res.status(403).json({error})
        }
    }
}


module.exports = Authorization