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
router.post('/login',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.username){
    return res.json({status:1,message:'用户名为空'})
  }
  if(!req.body.password){
    return res.json({status:1,message:'密码为空'})
  }
  user.findUserLogin(req.body.username,req.body.password,(err,userSave)=>{
    if(userSave.length != 0){0
      //通过MD5查看密码
      let token_after = getMD5Password(userSave[0].id);
      res.json({status:0,data:{token_after,user:userSave},message:'用户登录成功'})
    }else{
      res.json({status:1,message:'用户名或密码错误'});
    }
  })
});

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
          res.json({status:0,message:'注册成功',data:doc});
          console.log(doc);
        }
      })
    }
  })
});

//用户提交评论
router.post('/postComment',(req,res,next)=>{
  let username = '匿名用户';
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(req.body.username){
    username = req.body.username
  }
  if(!req.body.movie_id){
    return res.json({status:1,message:'电影id为空'})
  }
  if(!req.body.context){
    return res.json({status:1,message:'评论内容为空'})
  }
  //根据数据集建立一个新的数据内容
  let saveComment = new comment({
    movie_id: req.body.movie_id,
    username: username,
    context: req.body.context,
    check:0
  })
  //保存合适的数据集
  saveComment.save((err)=>{
    if(err){
      res.json({status:1,message:err})
    }else{
      res.json({status:0,message:'评论成功'})
    }
  })
});

//用户点赞
router.post('/support',(req,res,next)=>{});

//用户找回密码
router.post('/findPassword',(req,res,next)=>{
  //需要输入用户的邮箱信息和手机信息，同时可以更新密码
  //这里需要两个返回情况，一个是req.body.repassword存在时，另一个是repassword不存在时
  //这个接口同时用于密码的重置，需要用户登录
  if(req.body.repassword){
    //当存在code登录状态时，验证其状态
    if(!req.body.user_id){
      return res.json({status:1,message:'用户登录错误'})
    }
    if(!req.body.password){
      return res.json({status:1,message:'用户老密码错误'})
    }
    if(req.body.token == getMD5Password(req.body.user_id)){
      user.findOne({_id:req.body.user_id,password:req.body.repassword},(err,checkUser)=>{
        if(checkUser){
          user.update({_id:req.body.user_id},{password:req.body.repassword},(err,userUpdate)=>{
            if(err){
              return res.json({status:1,message:'更改错误',data:err})
            }else{
              return res.json({status:0,message:'更改成功',data:userUpdate})
            }
          })
        }else{
          return res.json({status:1,message:'用户老密码错误'})
        }
      })
    }else{
      res.json({status:1,message:'信息错误',token:req.body.token})
    }
  }else{
    //这里只是验证mail和phone，返回验证成功提示和提交的字段，用于之后改密码的操作
    if(!req.body.username){
      return res.json({status:1,message:'用户名称为空'})
    }
    if(!req.body.usermail){
      return res.json({status:1,message:'用户邮箱为空'})
    }
    if(!req.body.userphone){
      return res.json({status:1,message:'用户手机为空'})
    }
    user.findUserPassword(req.body.username,req.body.usermail,req.body.userphone,(err,userFound)=>{
      if(userFound.length!=0){
        return res.json({
          status:0,
          message:'验证成功，请修改密码',
          data:{
            username:req.body.username,
            userMail:req.body.usermail,
            userPhone:req.body.userphone
          }
        })
      }else{
        return res.json({status:1,message:'信息错误'})
      }
    })
  }
});

//用户发送站内信
router.post('/sendEmail',(req,res,next)=>{});

//用户显示站内信，其中的receive参数值为1时是发送的内容，值为2时是收到的内容
router.post('/showEmail',(req,res,next)=>{});

//获取MD5的值
let getMD5Password = (id) => {
  let md5 = crypto.createHash('md5');
  let token_before = id + init_token;
  return md5.update(token_before).digest('hex');
};

module.exports = router;