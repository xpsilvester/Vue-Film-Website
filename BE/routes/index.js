const express = require('express');
//路由引入
const router = express.Router();
//数据库引入
const mongoose = require('mongoose');
//models引入
const recommend = require('../models/recommend');
const movie = require('../models/movie');
const article = require('../models/article');
const user = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Mongoose测试
router.get('/mongooseTest',(req,res,next)=>{
  mongoose.connect('mongodb://localhost:27017/pets');
  mongoose.Promise = global.Promise;
  let Cat = mongoose.model('Cat',{name: String});
  let sam = new Cat({name: 'Sam'});
  sam.save(function(err,doc){
    if(err){
      console.log(err);
    }else{
      console.log('success insert');
      res.send(doc);
    }
  })
})

//显示主页的推荐大图
router.get('/showIndex',(req,res,next)=>{
  recommend.findAll((err,getRecommend)=>{
    if(err){
      return res.json({status:1,message:'获取推荐失败',data:err})
    }
    return res.json({status:0,message:'获取推荐成功',data:getRecommend})
  })
})

//显示所有的排行榜，也就是对于电影字段index的样式
router.get('/showRanking',(req,res,next)=>{
  movie.find({movieMainPage:true},(err,getMovies)=>{
    if(err){
      return res.json({status:1,message:'获取主页失败',data:err})
    }
    return res.json({status:0,message:'获取主页成功',data:getMovies})
  })
})

//显示文章列表
router.get('/showArticle',(req,res,next)=>{
  article.findAll((err,getArticles)=>{
    if(err){
      return res.json({status:1,message:'获取文章列表失败',data:err})
    }
    return res.json({status:0,message:'获取文章列表成功',data:getArticles})
  })
})

//显示文章的内容
router.post('/articleDetail',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.article_id){
    return res.json({status:1,message:'文章id出错'})
  }
  article.findById(req.body.article_id,(err,getArticle)=>{
    if(err){
      return res.json({status:1,message:'找不到文章',data:err})
    }
    return res.json({status:0,message:'获取文章成功',data:getArticle})
  })
})

//显示用户个人信息的内容
router.post('/showUser',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.user_id){
    return res.json({status:1,message:'用户id为空'})
  }
  user.findById(req.body.user_id,(err,getUser)=>{
    if(err){
      return res.json({status:1,message:'用户id不存在'})
    }else{
      return res.json({
        status:0,
        message:'获取用户信息成功',
        data:{
          user_id: getUser._id,
          username: getUser.username,
          userMail: getUser.userMail,
          userPhone: getUser.userPhone,
          userStop: getUser.userStop
        }
      })
    }
  })
})

module.exports = router;
