//数据库
const mongoose = require('../common/db');
//电影数据集
let movie = new mongoose.Schema({
    name: String,
    picture: String,
    link: String,
    download: String,
    movieNumSuppose: Number
},{
    timestamps: {
      createdAt: 'created', 
      updatedAt: 'updated'
    }
});

//电影常用操作方法
movie.statics.findByMovieName = function(m_name,callBack){
    this.find({name:m_name,check:true},callBack)
}

movie.statics.findAll = function(callBack){
    this.find({},callBack)
}

let movieModel = mongoose.model('movie',movie)

module.exports = movieModel;