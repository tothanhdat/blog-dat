const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({

    username: String,

    password: String,
    
    /**
     * 1. Admin
     * 0. User
     */
    role: { type: Number, default: 0 },

    //Trạng thái hoạt động
    status: { type: Number, default: 1 },

    //Ngày tạo
    createAt: { type: Date, default: Date.now() },
  
});

const USER_MODEL = mongoose.model('user', userSchema);
module.exports  = USER_MODEL;