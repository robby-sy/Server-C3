const bycrypt = require('bcryptjs')
const salt = bycrypt.genSaltSync(10)

function createHash(password){
    return bycrypt.hashSync(password,salt)
}

function compareHash(password,encryptedPassword){
    return bycrypt.compareSync(password,encryptedPassword)
}

module.exports = {createHash,compareHash}