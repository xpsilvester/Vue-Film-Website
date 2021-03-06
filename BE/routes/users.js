const express = require('express');
const router = express.Router();
const user = require('../models/user');
const crypto = require('crypto');
const movie = require('../models/movie');
const mail = require('../models/mail');
const comment = require('../models/comment');
const $token = require('../common/token')

const init_token = 'TKL02o';

/* GET users listing. */
router.get('/', function(req, res, next) {
  let payload = 'ter'
  let $createToken = $token.createToken(payload,2 * 60 *60),
      getToken = req.query.token
  return res.json({ decode:  $token.decodeToken(getToken) ,newToken: $createToken,check: $token.checkToken(getToken)})
});

//鉴权检查登录状态
router.get('/check',function(req,res,next){
  let userToken = req.cookies.CMSToken,
      username = req.cookies.CMSName
  if($token.checkToken(userToken) && $token.decodeToken(userToken).payload.data == username){
    let newToken = $token.createToken(username,2 * 60 *60)
    return res.json({ status: 0 , newToken: newToken ,username:$token.decodeToken(userToken).payload.data })
  }else{
    return res.json({ status: 1 , newToken: '' })
  }
})

//用户登录接口
router.post('/login',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!/^[a-zA-Z0-9_-]{4,16}$/.test(req.body.username) || !req.body.username){//4到16位（字母，数字，下划线，减号）
    return res.json({status:1, message:'用户名为空或格式错误，请输入4到16位（字母，数字，下划线，减号）'})
  }
  if(!req.body.password || !/^[a-zA-Z0-9_-]{6,16}$/.test(req.body.password)){//6到16位（字母，数字，下划线，减号）
    return res.json({status:1,message:'密码为空或格式错误，请输入6到16位（字母，数字，下划线，减号）'})
  }
  user.findUserLogin(req.body.username,getMD5Password(req.body.password),(err,userSave)=>{
    if(userSave.length != 0){
      //通过MD5查看密码
      let token = getMD5Password(userSave[0].id);
      res.json({status:0,data:userSave[0],message:'用户登录成功',token: $token.createToken(req.body.username,2 * 60 *60)})
    }else{
      res.json({status:1,message:'用户名或密码错误'});
    }
  })
});
//用户注册接口
router.post('/register',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!/^[a-zA-Z0-9_-]{4,16}$/.test(req.body.username) || !req.body.username){//4到16位（字母，数字，下划线，减号）
    return res.json({status:1,message:'用户名为空或格式错误，请输入4到16位（字母，数字，下划线，减号）'})
  }
  if(!req.body.password || !/^[a-zA-Z0-9_-]{6,16}$/.test(req.body.password)){//6到16位（字母，数字，下划线，减号）
    return res.json({status:1,message:'密码为空或格式错误，请输入6到16位（字母，数字，下划线，减号）'})
  }
  if(!req.body.usermail || !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(req.body.usermail)){
    return res.json({status:1,message:'用户邮箱为空或格式错误'})
  }
  if(!req.body.userphone || !/^\d{11}$/.test(req.body.userphone)){//11位数字
    return res.json({status:1,message:'用户手机为空或格式错误'})
  }
  user.findByUsername(req.body.username,function(err,userSave){
    if(userSave.length != 0){
      //返回错误信息
      return res.json({status:1,message:'用户已存在'})
    }else{
      let registerUser = new user({
        username: req.body.username,
        password: getMD5Password(req.body.password),
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
          res.json({status:0,message:'注册成功',data:doc ,token: $token.createToken(req.body.username,2 * 60 *60)});
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
router.post('/support',(req,res,next)=>{
  //保存合适的数据集
  if(!req.body.movie_id){
    return res.json({status:1,message:'电影id传递失败'})
  }
  movie.findById(req.body.movie_id,(err,supporMovie)=>{
    if(!supporMovie){
      return res.json({status:1,message:'找不到该电影'})
    }
    //更新操作
    movie.update({_id:req.body.movie_id},{movieNumSuppose:supporMovie.movieNumSuppose+1},(err)=>{
      if(err){
        return res.json({status:1,message:'点赞失败',data:err})
      }
      return res.json({status:0,message:'点赞成功'})
    })
  })
});

//用户下载
router.post('/download',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.movie_id){
    return res.json({status:1,message:'电影id传递失败'})
  }
  movie.findById(req.body.movie_id,(err,supporMovie)=>{
    if(!supporMovie){
      return res.json({status:1,message:'找不到该电影'})
    }
    //更新操作
    movie.update({_id:req.body.movie_id},{movieNumDownload:supporMovie.movieNumDownload+1},(err)=>{
      if(err){
        return res.json({status:1,message:'获取下载链接失败',data:err})
      }
      return res.json({status:0,message:'获取下载链接成功',data:supporMovie.movieDownload})
    })
  })
});

//用户找回密码
router.post('/findPassword',(req,res,next)=>{
  //需要输入用户的邮箱信息和手机信息，同时可以更新密码
  //这里需要两个返回情况，一个是req.body.repassword存在时，另一个是repassword不存在时
  //这个接口同时用于密码的重置，需要用户登录
  if(req.body.repassword){
    //当存在时，需要验证其登录情况或者验证其code
    if(req.body.token){
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
        res.json({status:1,message:'用户登录信息错误',token:req.body.token})
      }
    }else{
      //不存在code时，直接验证mail和phone
      user.findUserPassword(req.body.username,req.body.usermail,req.body.userphone,(err,userFound)=>{
        if(userFound.length!=0){
          user.update({_id:userFound[0]._id},{password:req.body.repassword},(err,userUpdate) => {
            if(err){
              return res.json({status:1,message:'更改错误',data:err})
            }
            return res.json({status:0,message:'更改成功',data:userUpdate})
          })
        }else{
          return res.json({status:1,message:'信息错误'})
        }
      })
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
router.post('/sendEmail',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.token){
    return res.json({status:1,message:'用户登录状态错误'})
  }
  if(!req.body.user_id){
    return res.json({status:1,message:'用户登录状态出错'})
  }
  if(!req.body.tousername){
    return res.json({status:1,message:'未选择相关的用户'})
  }
  if(!req.body.title){
    return res.json({status:1,message:'标题不能为空'})
  }
  if(!req.body.context){
    return res.json({status:1,message:'内容不能为空'})
  }
  if(req.body.token == getMD5Password(req.body.user_id)){
    //存入数据库之前需要先在数据库中获取到要发送用户的user_id
    user.findByUsername(req.body.tousername,(err,toUser)=>{
      if(toUser.length != 0){
        let NewEmail = new mail({
          fromUser: req.body.user_id,
          toUser: toUser[0]._id,
          title: req.body.title,
          context: req.body.context
        })
        NewEmail.save((err)=>{
          if(err){
            return res.json({status:1,message:'发送失败',data:err})
          }
          return res.json({status:0,message:'发送成功'})
        })
      }else{
        return res.json({status:1,message:'您发送的对象不存在'})
      }
    })
  }else{
    return res.json({status:1,message:'用户登录错误',token:getMD5Password(req.body.user_id)})
  }
});

//用户显示站内信，其中的receive参数值为1时是发送的内容，值为2时是收到的内容
router.post('/showEmail',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.token){
    return res.json({status:1,message:'用户登录状态错误'})
  }
  if(!req.body.user_id){
    return res.json({status:1,message:'用户登录状态出错'})
  }
  if(!req.body.receive){
    return res.json({status:1,message:'receive参数出错'})
  }
  if(req.body.token == getMD5Password(req.body.user_id)){
    if(req.body.receive == 1){
      //发送的站内信
      mail.findByFromUserId(req.body.user_id,(err,sendMail)=>{
        if(err){
          return res.json({status:1,message:'发送的站内信获取失败',data:err})
        }
        return res.json({status:0,message:'发送的站内信获取成功',data:sendMail})
      })
    }else{
      //收到的站内信
      mail.findByToUserId(req.body.user_id,(err,receiveMail)=>{
        if(err){
          return res.json({status:1,message:'收到的站内信获取失败',data:err})
        }
        return res.json({status:0,message:'收到的站内信获取成功',data:receiveMail})
      })
    }
  }else{
    return res.json({status:1,message:'用户登录错误',token:getMD5Password(req.body.user_id)})
  }
});

//获取MD5的值
let getMD5Password = (id) => {
  let md5 = crypto.createHash('md5');
  let token_before = id + init_token;
  return md5.update(token_before).digest('hex');
};

module.exports = router;