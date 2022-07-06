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

    let { title, content, category, shortDesc, image } = req.body;
    console.log({ title, content, category, shortDesc, image });

    let infoBlog = await BLOG_MODEL.insert({ title, content, image, category, shortDesc })

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
    let { title, content, image, category, shortDesc } = req.body;
    let infoBlog = await BLOG_MODEL.update({ blogID, title, content, image, category, shortDesc })
    res.json(infoBlog)
})


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
    let infoBlog = await BLOG_MODEL.getInfo({ blogID });
    res.json(infoBlog)
})

route.get('/remove/:blogID', async (req, res) => {
    let { blogID } = req.params;
    await BLOG_MODEL.remove({ blogID })
    res.redirect('/dashboard');
})

module.exports = route;