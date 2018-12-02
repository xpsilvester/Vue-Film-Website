//数据库
const mongoose = require('../common/db');
//文章数据集
let article = new mongoose.Schema({
    articleTitle: String,
    articleContext: String,
    articleTime: String
},{
    timestamps: {
      createdAt: 'created', 
      updatedAt: 'updated'
    }
});

//获取全部文章
article.statics.findAll = function(callBack){
    this.find({},callBack)
}

let articleModel = mongoose.model('article',article)

module.exports = articleModel;