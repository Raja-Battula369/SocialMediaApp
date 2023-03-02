const DataBase=require('./DataBase/Db');
const dotenv=require('dotenv');
const app = require('./app');
const {posts,users}=require('./data/index');
const Post=require('./models/postsModel');
const User=require('./models/userModel');

dotenv.config();

const DB=process.env.DATABASE;
const PORT=process.env.PORT;

const server=async()=> {
    await DataBase(DB);
    // await Post.insertMany(posts);
    // await User.insertMany(users);
    app.listen(PORT,()=> {
        console.log('Server listening....!');
    });
};

server();