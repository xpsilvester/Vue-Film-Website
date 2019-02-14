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
const comment = require('../models/comment');

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
      if(err){
        return res.json({status:1,message:'审核失败',data:err})
      }
      if(findUser.length == 0){
        return res.json({status:1,message:'用户不存在',data:findUser})
      }
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
router.get('/getmovies', (req, res, next)=> {
  movie.findAll((err,allMovie)=>{
    if(err){
      return res.json({status:1,message:'获取电影失败'})
    }
    return res.json({status:0,message:'获取电影成功',data:allMovie})
  })
});

//显示后台的所有评论
router.get('/commentsList',(req,res,next)=>{
  comment.findAll((err,allComment)=>{
    if(err){
      return res.json({status:1,message:'获取失败',data:err})
    }
    res.json({status:0,message:'获取成功',data:allComment})
  })
})

//审核用户评论
router.post('/checkComment',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.commentid){
    return res.json({status:1,message:'评论id传递失败'})
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
  //验证权限
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    user.findByUsername(req.body.username,(err,findUser)=>{
      if(err){
        return res.json({status:1,message:'审核失败',data:err})
      }
      if(findUser.length == 0){
        return res.json({status:1,message:'用户不存在',data:findUser})
      }
      if(findUser[0].userAdmin && !findUser[0].userStop){
        //更新操作
        comment.update({_id:req.body.commentid},{check:true},(err,updateComment)=>{
          if(err){
            return res.json({status:1,message:'审核失败',data:err})
          }else{
            return res.json({status:0,message:'操作成功',data:updateComment})
          }
        })
      }else{
        return res.json({status:1,message:'用户没有权限或者已经停用'})
      }
    })
  }else{
    return res.json({status:1,message:check.message})
  }
})

//对用户的评论进行删除
router.post('/delComment',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.commentid){
    return res.json({status:1,message:'评论id传递失败'})
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
  //验证权限
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    user.findByUsername(req.body.username,(err,findUser)=>{
      if(err){
        return res.json({status:1,message:'审核失败',data:err})
      }
      if(findUser.length == 0){
        return res.json({status:1,message:'用户不存在',data:findUser})
      }
      if(findUser[0].userAdmin && !findUser[0].userStop){
        //删除操作
        comment.remove({_id:req.body.commentid},(err,delComment)=>{
          if(err){
            return res.json({status:1,message:'删除失败',data:err})
          }else{
            return res.json({status:0,message:'删除成功',data:delComment})
          }
        })
      }else{
        return res.json({status:1,message:'用户没有权限或者已经停用'})
      }
    })
  }else{
    return res.json({status:1,message:check.message})
  }
})

//封停用户
router.post('/stopUser',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.userid){
    return res.json({status:1,message:'评论id传递失败'})
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
  //验证权限
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    user.findByUsername(req.body.username,(err,findUser)=>{
      if(err){
        return res.json({status:1,message:'审核失败',data:err})
      }
      if(findUser.length == 0){
        return res.json({status:1,message:'用户不存在',data:findUser})
      }
      if(findUser[0].userAdmin && !findUser[0].userStop){
        //更新操作
        user.update({_id:req.body.userid},{userStop:true},(err,delComment)=>{
          if(err){
            return res.json({status:1,message:'操作失败',data:err})
          }else{
            return res.json({status:0,message:'封停成功',data:delComment})
          }
        })
      }else{
        return res.json({status:1,message:'用户没有权限或者已经停用'})
      }
    })
  }else{
    return res.json({status:1,message:check.message})
  }
})

//用户密码更改（管理员）
router.post('/changeUser',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.userid){
    return res.json({status:1,message:'评论id传递失败'})
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
  if(!req.body.newPassword){
    return res.json({status:1,message:'用户新密码为空'})
  }
  //验证权限
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    user.findByUsername(req.body.username,(err,findUser)=>{
      if(err){
        return res.json({status:1,message:'审核失败',data:err})
      }
      if(findUser.length == 0){
        return res.json({status:1,message:'用户不存在',data:findUser})
      }
      if(findUser[0].userAdmin && !findUser[0].userStop){
        //更新操作
        user.update({_id:req.body.userid},{password:req.body.password},(err,updateUser)=>{
          if(err){
            return res.json({status:1,message:'操作失败',data:err})
          }else{
            return res.json({status:0,message:'修改成功',data:updateUser})
          }
        })
      }else{
        return res.json({status:1,message:'用户没有权限或者已经停用'})
      }
    })
  }else{
    return res.json({status:1,message:check.message})
  }
})

//后台所有用户资料显示
router.post('/showUser',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.username){
    return res.json({status:1,message:'用户名为空'})
  }
  if(!req.body.token){
    return res.json({status:1,message:'登录出错'})
  }
  if(!req.body.id){
    return res.json({status:1,message:'用户传递错误'})
  }
  //验证权限
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    user.findByUsername(req.body.username,(err,findUser)=>{
      if(err){
        return res.json({status:1,message:'审核失败',data:err})
      }
      if(findUser.length == 0){
        return res.json({status:1,message:'用户不存在',data:findUser})
      }
      if(findUser[0].userAdmin && !findUser[0].userStop){
        //查找操作
        user.findAll((err,allUser)=>{
          if(err){
            return res.json({status:1,message:'操作失败',data:err})
          }else{
            return res.json({status:0,message:'获取成功',data:allUser})
          }
        })
      }else{
        return res.json({status:1,message:'用户没有权限或者已经停用'})
      }
    })
  }else{
    return res.json({status:1,message:check.message})
  }
})

//后台用户权限管理
router.post('/powerUpdate',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.userid){
    return res.json({status:1,message:'用户id传递失败'})
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

  //验证权限
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    user.findByUsername(req.body.username,(err,findUser)=>{
      if(err){
        return res.json({status:1,message:'审核失败',data:err})
      }
      if(findUser.length == 0){
        return res.json({status:1,message:'用户不存在',data:findUser})
      }
      if(findUser[0].userAdmin && !findUser[0].userStop){
        //更新操作
        user.update({_id:req.body.userid},{userAdmin:true},(err,updateUser)=>{
          if(err){
            return res.json({status:1,message:'操作失败',data:err})
          }else{
            return res.json({status:0,message:'修改成功',data:updateUser})
          }
        })
      }else{
        return res.json({status:1,message:'用户没有权限或者已经停用'})
      }
    })
  }else{
    return res.json({status:1,message:check.message})
  }
})

//后台新增文章
router.post('/addArticle',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.token){
    return res.json({status:1,message:'登录出错'})
  }
  if(!req.body.id){
    return res.json({status:1,message:'用户传递错误'})
  }
  if(!req.body.username){
    return res.json({status:1,message:'用户名为空'})
  }
  if(!req.body.articletitle){
    return res.json({status:1,message:'文章名称为空'})
  }
  if(!req.body.articlecontext){
    return res.json({status:1,message:'文章内容为空'})
  }
  //验证权限
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    user.findByUsername(req.body.username,(err,findUser)=>{
      if(err){
        return res.json({status:1,message:'审核失败',data:err})
      }
      if(findUser.length == 0){
        return res.json({status:1,message:'用户不存在',data:findUser})
      }
      if(findUser[0].userAdmin && !findUser[0].userStop){
        //有权限的情况下
        let saveArticle = new article({
          articleTitle:req.body.articletitle,
          articleContext:req.body.articlecontext,
          articleTime: Date.now()
        })
        saveArticle.save((err)=>{
          if(err){
            return res.json({status:1,message:新增文章失败,data:err})
          }else{
            return res.json({status:1,message:新增文章成功})
          }
        })
      }else{
        return res.json({status:1,message:'用户没有权限或者已经停用'})
      }
    })
  }else{
    return res.json({status:1,message:check.message})
  }
})

//后台删除文章
router.post('/delArticle',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.token){
    return res.json({status:1,message:'登录出错'})
  }
  if(!req.body.username){
    return res.json({status:1,message:'用户名为空'})
  }
  if(!req.body.id){
    return res.json({status:1,message:'用户传递错误'})
  }
  if(!req.body.articleid){
    return res.json({status:1,message:'文章id为空'})
  }
  
  //验证权限
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    user.findByUsername(req.body.username,(err,findUser)=>{
      if(err){
        return res.json({status:1,message:'审核失败',data:err})
      }
      if(findUser.length == 0){
        return res.json({status:1,message:'用户不存在',data:findUser})
      }
      if(findUser[0].userAdmin && !findUser[0].userStop){
        //有权限的情况下
        article.remove({_id:req.body.articleid},(err,delArticle)=>{
          if(err){
            return res.json({status:1,message:'删除文章失败',data:err})
          }else{
            return res.json({status:0,message:'删除文章成功',data:delArticle})
          }
        })
      }else{
        return res.json({status:1,message:'用户没有权限或者已经停用'})
      }
    })
  }else{
    return res.json({status:1,message:check.message})
  }
}) 

//新增主页推荐
router.post('/addRecommend',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.token){
    return res.json({status:1,message:'登录出错'})
  }
  if(!req.body.id){
    return res.json({status:1,message:'用户传递错误'})
  }
  if(!req.body.username){
    return res.json({status:1,message:'用户名为空'})
  }
  if(!req.body.recommendimg){
    return res.json({status:1,message:'推荐图片为空'})
  }
  if(!req.body.recommendsrc){
    return res.json({status:1,message:'推荐跳转地址为空'})
  }
  if(!req.body.recommendtitle){
    return res.json({status:1,message:'推荐标题为空'})
  }
  //验证权限
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    user.findByUsername(req.body.username,(err,findUser)=>{
      if(err){
        return res.json({status:1,message:'审核失败',data:err})
      }
      if(findUser.length == 0){
        return res.json({status:1,message:'用户不存在',data:findUser})
      }
      if(findUser[0].userAdmin && !findUser[0].userStop){
        //有权限的情况下
        let saveRecommend = new recommend({
          recommendImg:req.body.recommendimg,
          recommendSrc:req.body.recommendsrc,
          recommendTitle:req.body.recommendtitle
        })
        saveRecommend.save((err)=>{
          if(err){
            return res.json({status:1,message:新增主页推荐失败,data:err})
          }else{
            return res.json({status:1,message:新增主页推荐成功})
          }
        })
      }else{
        return res.json({status:1,message:'用户没有权限或者已经停用'})
      }
    })
  }else{
    return res.json({status:1,message:check.message})
  }
})

//后台删除主页推荐
router.post('/delRecommend',(req,res,next)=>{
  //验证完整性，这里使用简单的if方式，（后续可以使用正则表达式对输入的格式进行验证）
  if(!req.body.token){
    return res.json({status:1,message:'登录出错'})
  }
  if(!req.body.username){
    return res.json({status:1,message:'用户名为空'})
  }
  if(!req.body.id){
    return res.json({status:1,message:'用户传递错误'})
  }
  if(!req.body.recommendid){
    return res.json({status:1,message:'主页id为空'})
  }
  
  //验证权限
  let check = {error: 0,message:'成功'} //checkAdminPower(req.body.username,req.body.token,req.body.id);
  if(check.error == 0){
    user.findByUsername(req.body.username,(err,findUser)=>{
      if(err){
        return res.json({status:1,message:'审核失败',data:err})
      }
      if(findUser.length == 0){
        return res.json({status:1,message:'用户不存在',data:findUser})
      }
      if(findUser[0].userAdmin && !findUser[0].userStop){
        //有权限的情况下
        recommend.remove({_id:req.body.recommendid},(err,delRecommend)=>{
          if(err){
            return res.json({status:1,message:'删除主页失败',data:err})
          }else{
            return res.json({status:0,message:'删除主页成功',data:delRecommend})
          }
        })
      }else{
        return res.json({status:1,message:'用户没有权限或者已经停用'})
      }
    })
  }else{
    return res.json({status:1,message:check.message})
  }
})

module.exports = router;
