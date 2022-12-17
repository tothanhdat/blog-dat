const route             = require('express').Router();
const moment            = require('moment')
const BLOG_MODEL        = require('../models/blog.js');
const BLOG_COLL         = require('../database/blog-coll.js');
const { renderToView }  = require('../utils/childRouting');

/**
 * API Lấy danh sách tất cả bài viết
 */
 route.get('/', async (req, res, next) => {

    let { page } = req.query || 1;
    let perPage = 6;
    
    await BLOG_COLL
    .find({ status: 1 })
    .sort({ createAt: -1 })
    .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec((err, products) => {
            BLOG_COLL.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
            if (err) return next(err);
            //res.send(products) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
            renderToView(req, res, 'pages/list-post.ejs', {products, current: page, pages: Math.ceil(count / perPage)})
        });
    });

    //Các bài viết có views cao nhất

    // res.render('pages/list-post.ejs', {
    //     moment,
    //     listBlog: listBlog.data,
    //     CATEGORY
    // })
})

/**
 * API Lấy danh sách bài viết theo danh mục
 */
 route.get('/type/:categoryID', async (req, res, next) => {
    let { categoryID } = req.params;
    let { page } = req.query || 1;
    let perPage = 6;
    
    await BLOG_COLL
    .find({category: categoryID, status: 1})
    .sort({ createAt: -1 })
    .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec((err, products) => {
        BLOG_COLL
        .find({category: categoryID, status: 1})
        .countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
        if (err) return next(err);
        //res.send(products) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
        renderToView(req, res, 'pages/list-post-category.ejs', {categoryID, products, current: page, pages: Math.ceil(count / perPage)})
    });
    });

    
})

module.exports = route;