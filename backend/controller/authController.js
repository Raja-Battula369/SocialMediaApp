const bcrypto = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../appError');



const signToken = id => {
    return jwt.sign({ id }, process.env.Token, {
        expiresIn: '1h'
    });
}

const createToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + (30 * 24 * 3600000)),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token: token,
        data: user
    });

}
exports.register = catchAsync(async (req, res, next) => {

    const { firstName, lastName, email, password, picturePath, friends, location, occupation, } = req.body

    const salt = await bcrypto.genSalt(12);
    const HashPassword = await bcrypto.hash(password, salt);

    const originalName = picturePath;
    const filename = originalName !== undefined ? originalName.replace(/\s+/g, '_') : picturePath;
    const picture = filename;

    const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: HashPassword,
        picturePath: picture,
        friends: friends,
        location: location,
        occupation: occupation,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000)
    });

    createToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Plesae provid email or password', 400))
    }

    const user = await User.findOne({ email });
    if (!user || ! await bcrypto.compare(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401));
    };
    createToken(user, 200, res);
})
