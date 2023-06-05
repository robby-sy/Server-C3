'use strict';
const {createHash} = require('../helpers/passwordEncryption')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsToMany(models.Article,{through:'CustomerArticles'})
    }
  }
  Customer.init({
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        notNull:{
          msg : "Email is required"
        },
        notEmpty:{
          msg : "Email cannot empty"
        },
        isEmail:{
          msg:'Email format is invalid'
        }
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg : "Password is required"
        },
        notEmpty:{
          msg : "Password cannot empty"
        }
      }
    },
    role: DataTypes.STRING,
    username: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    profile_picture: DataTypes.STRING
  }, {hooks:{
    beforeCreate:(instance,options)=>{
      instance.password = createHash(instance.password)
    }
  },
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};