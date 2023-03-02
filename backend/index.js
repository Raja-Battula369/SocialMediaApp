const DataBase = require('./DataBase/Db');
const dotenv = require('dotenv');
const app = require('./app');
const Post = require('./models/postsModel');
const User = require('./models/userModel');

dotenv.config();

const DB = process.env.DATABASE;
const PORT = process.env.PORT;

const server = async () => {
    await DataBase(DB);

    app.listen(PORT, () => {
        console.log('Server listening....!');
    });
};

server();