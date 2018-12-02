//数据库
const mongoose = require('../common/db');
//推荐数据集
let recommend = new mongoose.Schema({
    movie_id: String,
    recommendImg: String,
    recommendSrc: String,
    recommendTitle: String
},{
    timestamps: {
      createdAt: 'created', 
      updatedAt: 'updated'
    }
});

//推荐常用操作方法
//通过ID获得主页推荐
recommend.statics.findByIndexId = function(m_id,callBack){
    this.find({movie_id:m_id,check:true},callBack)
}

//找到所有的推荐
recommend.statics.findAll = function(callBack){
    this.find({},callBack)
}

let recommendModel = mongoose.model('recommend',recommend)

module.exports = recommendModel;