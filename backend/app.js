const express = require('express');
const cors = require('cors');
const multer = require('multer');
const morgan = require('morgan');
const bodyParse = require('body-parser');
const helmet = require('helmet');

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
app.use(morgan('common'));
app.use(bodyParse.json({ limit: '20mb', extended: true }));
app.use(bodyParse.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());

app.use('/assets', express.static(path.join(__dirname, '/public/assets')));




//file storage;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets');
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname;
        const filename = originalName.replace(/\s+/g, '_');
        cb(null, (filename));
    },


});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('invalid image file!', false);
    }
};

const upload = multer({ storage: storage, fileFilter });

//routes with fileName;

app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);



app.all('*', (req, res, next) => {
    next(new AppError(`Can't find the ${req.originalUrl} on this server`, 404));
});


app.use(globalErrorHandler);




module.exports = app;
