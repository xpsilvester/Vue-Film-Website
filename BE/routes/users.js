const express = require('express');
const router = express.Router();
//数据库
const mongoose = require('../common/db');

//用户数据集
let user = new mongoose.Schema({
  username: String,
  password: String,
  userMail: String,
  userPhone: String,
  userAdmin: Boolean,
  userPower: Number,
  userStop: Boolean,
  updateTime: {type: Date, default: Date.now}
})

//用户的查找方法
user.statics.findAll = (callBack) => {
  this.find({},callBack)
}

//使用用户名查找的方式
user.statics.findByUsername = (name,callBack) => {
  this.find({username:name},callBack)
}

//登录匹配是不是拥有相同的用户名和密码并且没有处于封停状态
user.statics.findUserLogin = (name,password,callBack) => {
  this.find({username:name,password:password,userStop:false},callBack)
}

//验证邮箱、电话和用户名找到用户
user.statics.findUserPassword = (name,mail,phone,callBack) => {
  this.find({username:name,userMail:mail,userPhone:phone},callBack)
}

let userModel = mongoose.model('user',user);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
module.exports.userModel = userModel;