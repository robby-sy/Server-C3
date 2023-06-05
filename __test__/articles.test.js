const request = require("supertest");
const {sequelize,Customer} = require('../models')
const app = require('../app')
require("dotenv").config();
const { compareHash } = require("../helpers/passwordEncryption");
const { createTokenCS } = require("../helpers/jsonWebTokenCS");

beforeAll(async ()=>{
    authors = require('../dummy/author.json')
    authors.forEach(el =>{
        el.updatedAt = new Date()
        el.createdAt = new Date()
    })
    categories = require('../dummy/category.json')
    categories.forEach(el =>{
        el.updatedAt = new Date()
        el.createdAt = new Date()
    })
    data = require('../dummy/article.json')
    data.forEach(el =>{
        el.updatedAt = new Date()
        el.createdAt = new Date()
        el.status = 'Active'
    })
    await sequelize.queryInterface.bulkInsert('Authors',authors)
    await sequelize.queryInterface.bulkInsert('Categories',categories)
    // await sequelize.queryInterface.bulkInsert('Articles',data)
})

describe('GET/pub/articles', () =>{
    it('should get all article with status code 200',async ()=> {
        const response = await request(app).get('/pub/articles')
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
    })
})

afterAll(async ()=>{
    await sequelize.queryInterface.bulkDelete('Articles')
    await sequelize.queryInterface.bulkDelete('Authors')
    await sequelize.queryInterface.bulkDelete('Categories')
})