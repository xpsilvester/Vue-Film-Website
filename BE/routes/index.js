const express = require('express');
//路由引入
const router = express.Router();
//数据库引入
const mongoose = require('mongoose');

//定义路由：测试
router.get('/api/mongooseTest',function(req,res,next){
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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
