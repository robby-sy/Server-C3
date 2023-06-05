require("dotenv").config();
const {
  Author,
  Article,
  Category,
  History,
  Customer,
  CustomerArticle,
} = require("../models");
const { compareHash } = require("../helpers/passwordEncryption");
const { createTokenCS } = require("../helpers/jsonWebTokenCS");
const { OAuth2Client } = require("google-auth-library");
const makePassword = require("../helpers/createRandomPassword");
const { Op } = require("sequelize");
const axios = require("axios");

const client = new OAuth2Client(process.env.google_client_id);

class csController {
  static async customerRegister(req, res, next) {
    try {
      const {
        email,
        password,
        username,
        first_name,
        last_name,
        profile_picture,
      } = req.body;
      await Customer.create({
        email,
        password,
        role: "customer",
        username,
        first_name,
        last_name,
        profile_picture,
      });
      res.status(201).json({ message: "success create account" });
    } catch (error) {
      next(error);
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
      let payload = createTokenCS({ customerId: customer.id });
      let user = {
        id: customer.id,
        role: customer.role,
        email: customer.email,
        profile_picture: customer.profile_picture,
      };
      res.status(200).json({ message: "success login", token: payload, user });
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
      let customer = await Customer.findOne({
        where: {
          email: payload.email,
        },
      });

      if (!customer) {
        let newUsername = payload.given_name + payload.family_name;
        let newPassword = makePassword();
        let data = {
          password: newPassword,
          email: payload.email,
          role: "customer",
          username: newUsername,
          first_name: payload.given_name,
          last_name: payload.family_name,
          profile_picture: payload.picture,
        };
        customer = await Customer.create(data);
      }
      let token = createTokenCS({ customerId: customer.id });
      let user = {
        id: customer.id,
        role: customer.role,
        email: customer.email,
        profile_picture: customer.profile_picture,
      };
      res.status(200).json({ message: "success login", token, user });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async customerGetArticles(req, res, next) {
    let page;
    let size;
    let options = {
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Author,
          attributes: ["first_name", "last_name", "profile_picture"],
        },
      ],
    };
    let where = {};
    try {
      if (req.query.size || req.query.page) {
        size = req.query.size;
        page = req.query.page;
        options.limit = size;
        options.offset = page * size;
      }
      if (req.query.category) {
        where.categoryId = {
          [Op.or]: req.query.category.split(""),
        };
      }
      if (req.query.contains) {
        where.title = {
          [Op.iLike]: `%${req.query.contains}%`,
        };
      }
      options.where = where;
      console.log(options);
      const articles = await Article.findAndCountAll(options);
      res.status(200).json({ articles });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async customerGetArticle(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findOne({ where: { id } });
      const barcode = await axios({
        url: "https://api.qr-code-generator.com/v1/create?access-token=cUg4640wu0G_DMMaYiEDL9SX_u-BoDZ9wcYMTBBpTsNm-yR2CLUxy31HwJd44izf",
        method: "post",
        data: {
          frame_name: "no-frame",
          qr_code_text: "http://localhost:5173/article"+id,
          image_format: "SVG",
          qr_code_logo: "scan-me-square",
        },
      });
      res.status(200).json({ article,barcode:barcode.data});
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async customerGetLike(req, res, next) {
    let { id } = req.customer;
    let page;
    let size;
    let options = {
      attributes: ["id", "email", "username"],
      include: {
        model:Article,
        include:Author
      },
    };
    let where = {
      id,
    };
    try {
      if (req.query.size || req.query.page) {
        size = req.query.size;
        page = req.query.page;
        options.limit = size;
        options.offset = page * size;
      }
      if (req.query.category) {
        where.categoryId = {
          [Op.or]: req.query.category.split(""),
        };
      }
      if (req.query.contains) {
        where.title = {
          [Op.iLike]: `%${req.query.contains}%`,
        };
      }
      options.where = where;
      const customer = await Customer.findOne(options);
      res.status(200).json({ customer });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async customerAddLike(req, res, next) {
    try {
      let { id } = req.customer;
      let { articleId } = req.body;
      await CustomerArticle.create({ CustomerId: id, ArticleId: articleId });
      res.status(201).json({ message: "Success Giving Like" });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = csController;
