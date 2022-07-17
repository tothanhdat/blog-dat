const route             = require('express').Router();
const moment            = require('moment')
const BLOG_MODEL        = require('../models/blog.js');
const { CATEGORY }      = require('../constants/config');
const { uploadMulter }  = require('../utils/config_multer');

const { renderToView }  = require('../utils/childRouting');

/**
 * Thêm bài viết
 */
route.get('/add', async (req, res) => {
    renderToView(req, res, 'dashboard/add-post.ejs', {})
})

route.post('/add', async (req, res) => {
    let { image, title, shortDesc, category, content } = req.body;
    //console.log({ image, title, shortDesc, category, content });
    let infoBlog = await BLOG_MODEL.insert({ image, title, shortDesc, category, content })

    res.json(infoBlog)
})

/**
 * Cập nhật bài viết
 */
route.get('/update/:blogID', async (req, res) => {
    let { blogID } = req.params;
    let infoBlog = await BLOG_MODEL.getInfo({ blogID });
    renderToView(req, res, 'dashboard/update-post.ejs', {infoBlog: infoBlog.data, blogID})

})

route.post('/update/:blogID', async (req, res) => {
    let { blogID } = req.params;
    let { title, image, content, category, shortDesc } = req.body;
    let infoBlog = await BLOG_MODEL.update({ blogID, image, title, content, category, shortDesc })
    res.json(infoBlog)
})

route.post('/update-status/:blogID', async (req, res) => {
    let { blogID } = req.params;
    let { status } = req.body;
    let infoBlog = await BLOG_MODEL.updateStatus({ blogID, status })
    res.json(infoBlog)
})

route.get('/list-post-trending', async (req, res) => {
    let listBlogTrending = await BLOG_MODEL.getListTrending();
    res.json(listBlogTrending)
})


route.get('/:blogID', async (req, res) => {
    let { blogID } = req.params;
    let infoBlog = await BLOG_MODEL.getInfo({ blogID, views: 1 })
    // res.render('pages/info-post', { 
    //     infoBlog: infoBlog.data, 
    //     moment, 
    //     CATEGORY,
    //     nextPost: infoBlog.nextPost,
    //     previousPost: infoBlog.previousPost,
    // })
    renderToView(req, res, 'pages/info-post', {
        infoBlog: infoBlog.data, 
        nextPost: infoBlog.nextPost,
        previousPost: infoBlog.previousPost,
    })
})

route.get('/info/:blogID', async (req, res) => {
    let { blogID } = req.params;
    let infoBlog = await BLOG_MODEL.getInfo({ blogID });
    res.json(infoBlog)
})

route.get('/remove/:blogID', async (req, res) => {
    let { blogID } = req.params;
    await BLOG_MODEL.remove({ blogID })
    res.redirect('/dashboard');
})

module.exports = route;