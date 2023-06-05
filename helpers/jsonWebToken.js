const jwt = require('jsonwebtoken');
require('dotenv').config()

function createToken(data){
    return jwt.sign(data,process.env.jwtKey)
}

function verifyToken(token){
    return jwt.verify(token,process.env.jwtKey)
}


module.exports = {createToken,verifyToken}