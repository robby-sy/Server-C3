'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerArticle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CustomerArticle.init({
    CustomerId: DataTypes.INTEGER,
    ArticleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CustomerArticle',
  });
  return CustomerArticle;
};