const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');


exports.getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);

    const user = await User.findById(id, { password: 0, email: 0 });


    res.status(200).json(user);
});

exports.getUserFriends = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    const friends = await Promise.all(
        user.friends.map((id) => User.findById(id, { email: 0, password: 0 }))
    );

    res.status(200).json(friends);
});


exports.addRemoveFriend = catchAsync(async (req, res, next) => {
    const { id, friendId } = req.params;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {

        user.friends = user.friends.filter(id => id !== friendId);
        friend.friends = friend.friends.filter(Id => Id !== id);

    } else {

        user.friends.push(friendId);
        friend.friends.push(id);

    };

    await user.save();
    await friend.save();

    const friends = await Promise.all(
        user.friends.map((id) => User.findById(id, { email: 0, password: 0 }))
    );


    res.status(200).json(friends);
});
