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

/* GET admin page. */
router.get('/', function(req, res, next) {
  res.send('Hello World');
});

//后台管理需要验证其用户的后台管理权限
//后台管理admin，添加新的电影
router.post('/movieAdd',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  let movieMainPage = true;
  if(!req.body.username){
    return res.json({status:1,message:'用户名为空'})
  }
  if(!req.body.token){
    return res.json({status:1,message:'登录出错'})
  }
  if(!req.body.id){
    return res.json({status:1,message:'用户传递错误'})
  }
  if(!req.body.moviename){
    return res.json({status:1,message:'电影名称为空'})
  }
  if(!req.body.movieimg){
    return res.json({status:1,message:'电影图片为空'})
  }
  if(!req.body.moviedownload){
    return res.json({status:1,message:'电影下载地址为空'})
  }
  if(!req.body.moviemainpage){
    movieMainPage = false
  }
  //验证
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    //验证用户的情况
    user.findByUsername(req.body.username,(err,findUser)=>{
        if(findUser[0].userAdmin && !findUser[0].userStop){
            //根据数据集建立需要存入数据库的内容
            let saveMovie = new movie({
              movieName: req.body.moviename,
              movieImg: req.body.movieimg,
              movieVideo: req.body.movievideo,
              movieDownload: req.body.moviedownload,
              movieTime: Date.now(),
              movieNumSuppose: 0,
              movieNumDownload: 0,
              movieMainPage: movieMainPage
            })
            saveMovie.save((err)=>{
                if(err){
                    return res.json({status:1,message:err})
                }else{
                    return res.json({status:0,message:'添加成功'})
                }
            })
        }else{
            return res.json({status:1,message:'用户没有获得权限或者已经停用'})
        }
    })
  }else{
      return res.json({status:1,message:check.message})
  }
})

//后台管理admin，删除电影条目
router.post('/movieDel',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.movieid){
      return res.json({status:1,message:'电影id为空'})
  }
  if(!req.body.username){
      return res.json({status:1,message:'用户名为空'})
  }
  if(!req.body.token){
      return res.json({status:1,message:'登录出错'})
  }
  if(!req.body.id){
      return res.json({status:1,message:'用户传递错误'})
  }
  //验证
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    //验证用户的情况
    user.findByUsername(req.body.username,(err,findUser)=>{
        if(findUser[0].userAdmin && !findUser[0].userStop){
            movie.remove({_id:req.body.movieid},(err,delMovie)=>{
              if(err){
                return res.json({status:1,message:'删除失败',data:err})
              }else{
                return res.json({status:0,message:'删除成功',data:delMovie})
              }
            })
        }else{
            return res.json({status:1,message:'用户没有获得权限或者已经停用'})
        }
    })
  }else{
    return res.json({status:1,message:check.message})
  }
})

//后台管理admin，更新电影
router.post('/movieUpdate',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  let movieMainPage = true;
  if(!req.body.username){
    return res.json({status:1,message:'用户名为空'})
  }
  if(!req.body.token){
    return res.json({status:1,message:'登录出错'})
  }
  if(!req.body.id){
    return res.json({status:1,message:'用户传递错误'})
  }
  if(!req.body.moviename){
    return res.json({status:1,message:'电影名称为空'})
  }
  if(!req.body.movieimg){
    return res.json({status:1,message:'电影图片为空'})
  }
  if(!req.body.moviedownload){
    return res.json({status:1,message:'电影下载地址为空'})
  }
  if(!req.body.moviemainpage){
    movieMainPage = false
  }
  //验证
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    //验证用户的情况
    user.findByUsername(req.body.username,(err,findUser)=>{
        if(findUser[0].userAdmin && !findUser[0].userStop){
            //根据数据集建立需要存入数据库的内容
            let saveMovie = {
              movieName: req.body.moviename,
              movieImg: req.body.movieimg,
              movieVideo: req.body.movievideo,
              movieDownload: req.body.moviedownload,
              movieTime: Date.now(),
              movieNumSuppose: 0,
              movieNumDownload: 0,
              movieMainPage: movieMainPage
            }
            movie.update({_id:req.body.movieid},saveMovie,(err,updateMovie)=>{
              if(err){
                return res.json({status:1,message:'更新失败',data:err})
              }
              if(updateMovie.n == 0){
                return res.json({status:0,message:'电影id不存在',data:updateMovie})
              }
              return res.json({status:0,message:'更新成功',data:updateMovie})
            })
        }else{
            return res.json({status:1,message:'用户没有获得权限或者已经停用'})
        }
    })
  }else{
      return res.json({status:1,message:check.message})
  }
})

//显示后台所有电影
router.get('/getmovies', function(req, res, next) {
  movie.findAll((err,allMovie)=>{
    if(err){
      return res.json({status:1,message:'获取电影失败'})
    }
    return res.json({status:0,message:'获取电影成功',data:allMovie})
  })
});

module.exports = router;
