const express=require('express');
const {login}=require('../controller/authController');

const Router=express.Router();

Router.post('/login',login);

module.exports=Router;
