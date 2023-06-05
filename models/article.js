'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Article.belongsTo(models.Author,{foreignKey:"authorId"})
      Article.belongsTo(models.Category,{foreignKey:"categoryId"})
      Article.belongsToMany(models.Customer,{through:'CustomerArticles'})
    }
  }
  Article.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    imgUrl: DataTypes.TEXT,
    categoryId: DataTypes.INTEGER,
    authorId: DataTypes.INTEGER,
    status:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};