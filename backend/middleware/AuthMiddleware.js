const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');

exports.verifyToken = catchAsync(async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    };


    if (!token) {
        return next(new AppError('Your not login yet! please login for access', 401));
    };

    const decoded = await promisify(jwt.verify)(token, process.env.Token);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('user Does not exit', 401))
    };


    req.user = currentUser;
    next();
});