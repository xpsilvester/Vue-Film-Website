//数据库
const mongoose = require('../common/db');
//评论数据集
let comment = new mongoose.Schema({
    movie_id: String,
    username: String,
    context: String,
    check: Boolean
},{
    timestamps: {
      createdAt: 'created', 
      updatedAt: 'updated'
    }
});

//评论常用操作方法
comment.statics.findByMovieId = function(m_id,callBack){
    this.find({movie_id:m_id,check:true},callBack)
}

comment.statics.findAll = function(callBack){
    this.find({},callBack)
}

let commentModel = mongoose.model('comment',comment)

module.exports = commentModel;