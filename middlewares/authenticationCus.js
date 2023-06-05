const {verifyTokenCS} = require('../helpers/jsonWebTokenCS')
const {Customer} = require('../models')

async function Authentication(req,res,next){
    try {
        let {token} = req.headers
        if(!token) throw {name:'Authentication Error'}
        let {customerId} = verifyTokenCS(token)
        let customer = await Customer.findByPk(customerId)
        if(!customer) throw {name:'Authentication Error'}
        req.customer = {
            id : customer.id,
            role : customer.role
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