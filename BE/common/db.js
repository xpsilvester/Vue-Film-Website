const mongoose = require('mongoose');
let url = 'mongodb://localhost:27017/movieServer';

//连接数据库
mongoose.connect(url,{ useNewUrlParser: true });

module.exports = mongoose;