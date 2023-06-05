const jwt = require('jsonwebtoken');
require('dotenv').config()

function createTokenCS(data){
    return jwt.sign(data,process.env.jwtKeyCS)
}

function verifyTokenCS(token){
    return jwt.verify(token,process.env.jwtKeyCS)
}


module.exports = {createTokenCS,verifyTokenCS}