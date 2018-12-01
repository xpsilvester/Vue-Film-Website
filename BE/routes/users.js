const express = require('express');
const router = express.Router();
const user = require('../models/user');
const crypto = require('crypto');
const movie = require('../models/movie');
const mail = require('../models/mail');
const comment = require('../models/comment');

const init_token = 'TKL02o';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//用户登录接口
router.post('/login',(req,res,next)=>{});

//用户注册接口
router.post('/register',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.username){
    return res.json({status:1,message:'用户名为空'})
  }
  if(!req.body.password){
    return res.json({status:1,message:'密码为空'})
  }
  if(!req.body.usermail){
    return res.json({status:1,message:'用户邮箱为空'})
  }
  if(!req.body.userphone){
    return res.json({status:1,message:'用户手机为空'})
  }
  user.findByUsername(req.body.username,function(err,userSave){
    if(userSave.length != 0){
      //返回错误信息
      return res.json({status:1,message:'用户已注册'})
    }else{
      let registerUser = new user({
        username: req.body.username,
        password: req.body.password,
        userMail: req.body.usermail,
        userPhone: req.body.userphone,
        userAdmin: 0,
        userPower: 0,
        userStop: 0
      })
      registerUser.save((err,doc) => {
        if(err){
          res.json({status:1,message:err});
          console.log(err);
        }else{
          res.json({status:0,message:'注册成功'});
          console.log(doc);
        }
      })
    }
  })
});

//用户提交评论
router.post('/postComment',(req,res,next)=>{});

//用户点赞
router.post('/support',(req,res,next)=>{});

//用户找回密码
router.post('/findPassword',(req,res,next)=>{});

//用户发送站内信
router.post('/sendEmail',(req,res,next)=>{});

//用户显示站内信，其中的receive参数值为1时是发送的内容，值为2时是收到的内容
router.post('/showEmail',(req,res,next)=>{});

//获取MD5的值
let getMD5Password = (id) => {};

module.exports = router;