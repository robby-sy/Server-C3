'use strict';
const {createHash} = require('../helpers/passwordEncryption')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Author.hasMany(models.Article,{foreignKey:"authorId"})
    }
  }
  Author.init({
    username:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg : "User name is required"
        },
        notEmpty:{
          msg : "User name cannot empty"
        }
      }
    },
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
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    profile_picture: DataTypes.TEXT,
    address:DataTypes.STRING,
    role:DataTypes.STRING
  }, {
    hooks:{
      beforeCreate:(instance,options)=>{
        instance.password = createHash(instance.password)
      }
    },
    sequelize,
    modelName: 'Author',
  });
  return Author;
};