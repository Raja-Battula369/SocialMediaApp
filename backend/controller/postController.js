const Post = require('../models/postsModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../appError');
require("dotenv").config();
const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
// Upload
var picId;
const handleUpload = async (file) => {
    const random = Math.floor(Math.random() * 10000);
    picId = `${file.filename}+${random}`
    try {
        const res = await cloudinary.uploader.upload(file.path, { public_id: `${file.filename}+${random}` })
        return res;
    } catch (err) {
        console.log(err);
    }


}

//cloudinary uploaded file delete 
const handleUploadedFileDel = async (file) => {
    cloudinary.uploader.destroy(file.pic_id, function (error, result) {
        console.log(result, error);
    });
}

exports.createPost = catchAsync(async (req, res, next) => {

    const { userId, description } = req.body;

    const cloudRes = await handleUpload(req.file);


    const user = await User.findById(userId);

    const newPost = await Post.create({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description: description,
        userPicturePath: user.picturePath,
        picturePath: cloudRes.url,
        pic_id: picId,
        likes: {},
        comments: []

    }
    );
    if (!newPost) {
        return next(new AppError('New can not create', 404));
    };

    const post = await Post.find({ password: 0, email: 0 }).sort({ _id: -1 })
    res.status(201).json(post)

});


exports.getFeedPosts = catchAsync(async (req, res, next) => {
    const post = await Post.find({ password: 0, email: 0 }).sort({ _id: -1 })
    res.status(200).json(post);
});

exports.getPost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const post = await Post.findById(id, { password: 0, email: 0 });
    res.status(200).json(post);

});
exports.getUserPosts = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const post = await Post.find({ userId: userId }, { _id: 1, userId: 1, userPicturePath: 1, picturePath: 1 });
    res.status(200).json(post);
});


exports.likePost = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { userId } = req.body

    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {

        post.likes.delete(userId)
    } else {
        post.likes.set(userId, true);
    };

    const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, {
        new: true
    });

    res.status(200).json(updatedPost);
});

exports.createComment = catchAsync(async (req, res, next) => {

    const { friendId } = req.params;
    const { message } = req.body;
    const friend = await Post.findById(friendId);


    const commentsData = friend.comments;
    commentsData.push(message);

    const addComment = await Post.findByIdAndUpdate(friendId, { comments: commentsData }, { new: true });


    res.status(200).json(addComment);
});
exports.deletePost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post_id = await Post.findById(id, { pic_id: 1 });
    await Post.findByIdAndDelete(id);
    await handleUploadedFileDel(post_id);

    const post = await Post.find().sort({ _id: -1 })
    res.status(200).json(post);
});