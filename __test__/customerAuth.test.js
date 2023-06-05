const request = require("supertest");
const {sequelize,Customer} = require('../models')
const app = require('../app')
require("dotenv").config();
const { compareHash } = require("../helpers/passwordEncryption");
const { createTokenCS } = require("../helpers/jsonWebTokenCS");


describe('POST/pub/register', ()=>{
  it('should create new customer and return 201',async () => {
      const data ={
        email:'roby@test.com',
        password:'12345'
      }
      const response = await request(app).post('/pub/register').send(data)
      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message','success create account')
  })
  
  // it('should return 400 and error message "Email cannot empty"',async () => {
  //   const data = {
  //     email:"",
  //     password:'12345'
  //   }
  //   const response = await request(app).post('/pub/register').send(data)
  //   expect(response.status).toBe(400)
  //   expect(response.body).toBeInstanceOf(Object)
  //   expect(response.body).toHaveProperty('message',['Email cannot empty'])
  // })
  it('should return 400 and error message "Password cannot empty"',async () => {
    const data = {
      email:'roby@test.com',
      password:''
    }
    const response = await request(app).post('/pub/register').send(data)
    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message',['Password cannot empty'])
  })
  it('should return 400 and error message "Email is required"',async () => {
    const data = {
      password:'12345'
    }
    const response = await request(app).post('/pub/register').send(data)
    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message',['Email is required'])
  })
  it('should return 400 and error message "Password is required"',async () => {
    const data = {
      email:'roby@test.com'
    }
    const response = await request(app).post('/pub/register').send(data)
    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message',['Password is required'])
  })
  it('should return 400 and error message "Email format is invalid"',async () => {
    const data = {
      email:'roby@',
      password:'12345'
    }
    const response = await request(app).post('/pub/register').send(data)
    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message',['Email format is invalid'])
  })
  it('should return 400 and error message "This email has already been registered"',async () => {
    const data = {
      email:'roby@test.com',
      password:'12345'
    }
    const response = await request(app).post('/pub/register').send(data)
    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message','This email has already been registered')
  })
})

describe('POST/pub/login',()=>{
  
  it('shoult return 200 with access token', async ()=>{
    const data = {
      email:'roby@test.com',
      password:'12345'
    }
    const response = await request(app).post('/pub/login').send(data)
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message','success login')
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('user')
  })

  it('should return 404 with message Data not found', async ()=>{
    const data = {
      email:'roby22@test.com',
      password:'12345'
    }
    const response = await request(app).post('/pub/login').send(data)
    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message','Data not found')
  })
  it('should return 400 with message Incorrect email or password', async ()=>{
    const data = {
      email:'roby@test.com',
      password:'111111'
    }
    const response = await request(app).post('/pub/login').send(data)
    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message','Incorrect email or password')
  })
})

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete('Customers')
})