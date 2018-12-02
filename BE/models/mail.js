//数据库
const mongoose = require('../common/db');
//信数据集
let mail = new mongoose.Schema({
    fromUser: String,
    toUser: String,
    title: String,
    context: String
},{
    timestamps: {
      createdAt: 'created', 
      updatedAt: 'updated'
    }
});

//站内信常用操作方法
mail.statics.findByToUserId = function(user_id,callBack){
    this.find({toUser:user_id},callBack)
}

mail.statics.findByFromUserId = function(user_id,callBack){
    this.find({fromUser:user_id},callBack)
}

let mailModel = mongoose.model('mail',mail)

module.exports = mailModel;