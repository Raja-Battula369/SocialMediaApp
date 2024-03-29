const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    location: String,
    description: {
        type: String,
        trim: true
    },
    picturePath: String,
    userPicturePath: String,
    pic_id: String,
    likes: {
        type: Map,
        of: Boolean
    },
    comments: {
        type: Array,
        default: []
    },
}, { timestamps: true });

const Post = mongoose.model('Posts', postSchema);

module.exports = Post;
