const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const blogSchema = new Schema({

    /**
     * Nội dung
     */
    title: String,

    /**
     * Nội dung
     */
    content: String,

    /**
     * Nội dung ngắn
     */
    shortDesc: String,

    /**
     * Lượt xem
     */
    views: { type: Number, default: 0 },

    /**
     * Hình ảnh
     */
    image: String,

    /**
     * Danh mục
     */

    /**
     * 0: Không hoạt động
     * 1: Hoạt động
     */
    status: { type: Number, required: true, default: 1 },

    category: { type: Number, required: true, default: 1 },

    createAt: { type: Date, required: true, default: Date.now },

    lastUpdate: { type: Date, required: true, default: Date.now },
    
});

const BLOG_SCHEMA = mongoose.model('blog', blogSchema);
module.exports  = BLOG_SCHEMA;