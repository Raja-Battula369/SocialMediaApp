const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const path = require('path');
// const {fileURLToPath} =require('url');

const userRouter = require('./routers/userRouter');
const postRouter = require('./routers/postRouter');
const authRouter = require('./routers/authRouter');
const { createPost } = require('./controller/postController');
const { register } = require('./controller/authController');
const globalErrorHandler = require('./controller/errorController');
const { AppError } = require('./appError');
const { verifyToken } = require('./middleware/AuthMiddleware');

const app = express();

//configuration




app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('short'));
app.use(cors('*'));
app.use(express.json({ limit: "100mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());


app.use('/assets', express.static(path.join(__dirname, '/public/assets')));




//file storage;

//routes with fileName;

app.post('/auth/register', register);
app.post('/posts', verifyToken, createPost);

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);



app.all('*', (req, res, next) => {
    next(new AppError(`Can't find the ${req.originalUrl} on this server`, 404));
});


app.use(globalErrorHandler);




module.exports = app;
