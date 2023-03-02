const express=require('express');
const {verifyToken}=require('../middleware/AuthMiddleware');
const {getUser,getUserFriends,addRemoveFriend}=require('../controller/userController');

const Router=express.Router();

Router.get('/:id',verifyToken,getUser);

Router.get('/:id/friends',verifyToken,getUserFriends);

Router.patch('/:id/:friendId',verifyToken,addRemoveFriend);

module.exports=Router;
