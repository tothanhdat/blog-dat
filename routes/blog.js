const route             = require('express').Router();
const moment            = require('moment')
const BLOG_MODEL        = require('../models/blog.js');
const { CATEGORY }      = require('../constants/config');

/**
 * Thêm bài viết
 */
route.get('/add', async (req, res) => {
    res.render('pages/add-blog.ejs')
})

route.post('/add', async (req, res) => {
    let { title, content, image, category } = req.body;
    let infoBlog = await BLOG_MODEL.insert({ title, content, image, category })
    res.json(infoBlog)
})

/**
 * Cập nhật bài viết
 */
route.get('/update/:blogID', async (req, res) => {
    let { blogID } = req.params;
    let infoBlog = await BLOG_MODEL.getInfo({ blogID });
    res.render('pages/update-blog.ejs', { infoBlog: infoBlog.data, blogID })
})

route.post('/update/:blogID', async (req, res) => {
    let { blogID } = req.params;
    let { title, content, image, category } = req.body;
    let infoBlog = await BLOG_MODEL.update({ blogID, title, content, image, category })
    res.json(infoBlog)
})

// route.get('/list', async (req, res) => {
//     let listBlog = await BLOG_MODEL.getList()
//     res.json(listBlog)
// })

route.get('/list-post-trending', async (req, res) => {
    let listBlogTrending = await BLOG_MODEL.getListTrending();
    res.json(listBlogTrending)
})


route.get('/:blogID', async (req, res) => {
    let { blogID } = req.params;
    let infoBlog = await BLOG_MODEL.getInfo({ blogID, views: 1 })
    res.render('pages/info-post', { infoBlog: infoBlog.data, moment, CATEGORY })
})

route.get('/info/:blogID', async (req, res) => {
    let { blogID } = req.params;
    let infoBlog = await BLOG_MODEL.getInfo({ blogID })
    res.json(infoBlog)
})

module.exports = route;