require("dotenv").config();
const { Author, Article, Category, History , Customer} = require("../models");
const { compareHash } = require("../helpers/passwordEncryption");
const { createToken } = require("../helpers/jsonWebToken");
const { OAuth2Client } = require("google-auth-library");
const makePassword = require("../helpers/createRandomPassword");

const client = new OAuth2Client(process.env.google_client_id);

class Controller {
  static async createArticle(req, res, next) {
    try {
      let { title, content, imgUrl, categoryId } = req.body;
      const article = await Article.create({
        title,
        content,
        imgUrl,
        categoryId,
        authorId: req.user.id,
        status: "Active",
      });
      await History.create({
        title,
        description: `New Article with id ${article.id} created`,
        updatedBy: req.user.name,
      });
      res.status(201).json({ message: "success create new article", article });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getArticles(req, res, next) {
    try {
      let articles = await Article.findAll({
        include: [
          "Category",
          {
            model: Author,
            attributes: { exclude: ["password"] },
          },
        ],
      });
      res
        .status(200)
        .json({ message: "success read data", data: articles, user: req.user });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getArticle(req, res, next) {
    try {
      let { id } = req.params;
      let article = await Article.findByPk(id, {
        include: {
          model: Author,
          attributes: { exclude: ["password"] },
        },
      });
      if (!article) {
        throw { name: "Data not found" };
      }
      res.status(200).json({ message: "Data Found", Data: article });
    } catch (error) {
      next(error);
    }
  }

  static async deleteArticle(req, res, next) {
    try {
      let { id } = req.params;
      let article = await Article.findByPk(id);
      if (!article) {
        throw { name: "Data not found" };
      }
      await Article.destroy({
        where: {
          id,
        },
      });
      res
        .status(200)
        .json({ message: `Succes Delete Article "${article.title}"` });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      let categories = await Category.findAll({
        include: Article,
      });
      res.status(200).json({ message: "success read data", data: categories });
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req, res, next) {
    try {
      let category = req.body;
      await Category.create(category);
      await History.create({
        title: category.name,
        description: `Success Create Category with Name ${category.name}`,
        updatedBy: req.user.name,
      });
      res.status(201).json({ message: "success create category" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    let { id } = req.params;
    try {
      await Category.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({ message: "success delete category" });
    } catch (error) {
      next(error);
    }
  }

  static async registerAdmin(req, res, next) {
    let { username, password, address, phoneNumber, email } = req.body;
    try {
      let author = await Author.create({
        username,
        password,
        address,
        phoneNumber,
        email,
        role: "Admin",
      });
      res.status(201).json({ message: "Success Create Account", data: author });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      let { email, password } = req.body;
      if (!email)
        throw { name: "empty field", message: "Email required to login" };
      if (!password || password === "")
        throw { name: "empty field", message: "Password required to login" };
      let author = await Author.findOne({ where: { email } });
      if (!author) throw { name: "Data not found" };
      let passwordValidation = compareHash(password, author.password);
      if (!passwordValidation) throw { name: "Incorrect email or password" };
      let payload = createToken({ authorId: author.id });
      let user = {
        id:author.id,
        name:author.first_name + ' ' + author.last_name,
        picture:author.profile_picture,
        role:author.role
      }
      res.status(200).json({ message: "success login", token: payload, user});
    } catch (error) {
      next(error);
    }
  }

  static async googleSignIn(req, res, next) {
    try {
      let google_token = req.headers.token;
      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.google_client_id,
      });
      const payload = ticket.getPayload();
      let user = await Author.findOne({
        where: {
          email: payload.email,
        },
      });
      if (!user) {
        let newUsername = payload.given_name + payload.family_name;
        let newPassword = makePassword();
        let data = {
          username: newUsername,
          password: newPassword,
          email: payload.email,
          first_name: payload.given_name,
          last_name: payload.family_name,
          role: "user",
          profile_picture: payload.picture,
        };
        user = await Author.create(data);
      }
      let token = createToken({ authorId: user.id });
      res.status(200).json({ message: "success login", token });
    } catch (error) {
      next(error);
    }
  }

  static async editArticle(req, res, next) {
    try {
      let { id } = req.params;
      let {title,content,categoryId,imgUrl} = req.body;
      let success = await Article.update({title,content,categoryId,imgUrl}, {
        where: {
          id,
        },
      });
      if (!success) throw { name: "Data not found" };
      await History.create({
        title:`Article with id ${id} updated`,
        description:`Article with id ${id} successfully updated by ${req.user.name}` ,
        updatedBy: req.user.name
      });
      res.status(200).json({ message: "success update data" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async modifyArticle(req,res,next){
    try {
      let { id } = req.params;
      let {status} = req.body;
      let article = await Article.findByPk(id)
      let success = await Article.update({status}, {
        where: {
          id,
        },
      });
      if (!success) throw { name: "Data not found" };
      await History.create({
        title:article.title,
        description: `Article with id ${id} status has been updated from ${article.status} to ${status}`,
        updatedBy: req.user.name,
      });
      res.status(200).json({ message: "success update data"});
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getHistories(req,res,next){
    try {
      let histories = await History.findAll({
        order : [['createdAt','DESC']]
      })
      res.status(200).json({message:'success read histories',data:histories})
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  static async customerRegister(req,res,next){
    try {
      const {email,password} = req.body
      console.log(req.body);
      await Customer.create({email,password,role:'customer'})
      res.status(201).json({message:'success create account'})
    } catch (error) {
      next(error)
    }
  }

  static async customerLogin(req, res, next) {
    try {
      let { email, password } = req.body;
      if (!email)
        throw { name: "empty field", message: "Email required to login" };
      if (!password || password === "")
        throw { name: "empty field", message: "Password required to login" };
      let customer = await Customer.findOne({ where: { email } });
      if (!customer) throw { name: "Data not found" };
      let passwordValidation = compareHash(password, customer.password);
      if (!passwordValidation) throw { name: "Incorrect email or password" };
      let payload = createToken({ customerId: customer.id });
      let user = {
        id:customer.id,
        role:customer.role,
        email:customer.email
      }
      res.status(200).json({ message: "success login", token: payload, user});
    } catch (error) {
      next(error);
    }
  }

  static async customerGoogleSignIn(req, res, next) {
    try {
      let google_token = req.headers.token;
      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.google_client_id,
      });
      const payload = ticket.getPayload();
      let user = await Customer.findOne({
        where: {
          email: payload.email,
        },
      });
      if (!user) {
        let newUsername = payload.given_name + payload.family_name;
        let newPassword = makePassword();
        let data = {
          password: newPassword,
          email: payload.email,
          role: "customer",
        };
        user = await Customer.create(data);
      }
      let token = createToken({ authorId: user.id });
      res.status(200).json({ message: "success login", token });
    } catch (error) {
      next(error);
    }
  }

  static async customerGetArticles(req,res,next){
    let page;
    let size;
    let offset;
   try {
      if(req.query.size & req.query.page){
        size = req.query.size
        page = req.query.page
        offset = page*size
        console.log(size,page);
        let articles = await Article.findAndCountAll({
          limit:size,
          offset
        })
        res.send(articles)
      } 
      let articles = await Article.findAll()
      res.send(articles)
   } catch (error) {
      res.send(error)
   }
  }
}

module.exports = Controller;
