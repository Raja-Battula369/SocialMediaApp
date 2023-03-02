const mongoose=require('mongoose');

const DataBase=DB=> {
    return mongoose.connect(DB,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(console.log('DataBase successfully connected'));
};

module.exports=DataBase;