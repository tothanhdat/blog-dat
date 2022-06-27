const route             = require('express').Router();
const moment            = require('moment')
const BLOG_MODEL        = require('../models/blog.js');
const { CATEGORY }      = require('../constants/config');

/**
 * API Lấy danh sách bài viết theo danh mục
 */
 route.get('/', async (req, res) => {
    let { categoryID } = req.query;
    
    let listBlog = await BLOG_MODEL.getList({ categoryID })

    //Các bài viết có views cao nhất
    let listBlogTrending = await BLOG_MODEL.getListTrending();

    res.render('pages/list-post.ejs', {
        moment,
        listBlog: listBlog.data,
        listBlogTrending: listBlogTrending.data.slice(0, 4), //Lấy 4 bài
        CATEGORY
    })
})

module.exports = route;