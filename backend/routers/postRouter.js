const express = require('express');
const { getUserPosts, getFeedPosts, likePost, createComment, deletePost, getPost } = require('../controller/postController');
const { verifyToken } = require('../middleware/AuthMiddleware');

const Router = express.Router();

Router.get('/', verifyToken, getFeedPosts);
Router.get('/:id/post', verifyToken, getPost);
Router.get('/:userId/posts', verifyToken, getUserPosts);


Router.patch('/:id/like', verifyToken, likePost);
Router.patch('/:friendId/comments', verifyToken, createComment);

Router.delete('/:id/deletepost', verifyToken, deletePost);

module.exports = Router;