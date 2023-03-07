const Post = require('../models/postsModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../appError');

exports.createPost = catchAsync(async (req, res, next) => {

    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const originalName = picturePath;
    const extension = originalName.split('.').pop();
    const filename = originalName.replace(/\s+/g, '_');
    const picture = filename + '-' + Date.now() + '.' + extension;

    const newPost = await Post.create({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description: description,
        userPicturePath: user.picturePath,
        picturePath: picture,
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
    await Post.findByIdAndDelete(id);
    const post = await Post.find().sort({ _id: -1 })
    res.status(200).json(post);
});


