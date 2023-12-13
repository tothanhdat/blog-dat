const route             = require('express').Router();
// const moment            = require('moment')''
const BLOG_MODEL        = require('../models/blog.js');
const { renderToView }  = require('../utils/childRouting');
const multer            = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Thư mục lưu trữ tệp tin
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

/**
 * Thêm bài viết
 */
route.get('/add', async (req, res) => {
    renderToView(req, res, 'dashboard/add-post.ejs', {})
})

route.post('/add', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // console.log('File uploaded:', req.file.filename);
    let img = req.file.filename;
    let { title, shortDesc, category, content, tag } = req.body;
    let infoBlog = await BLOG_MODEL.insert({ image: `/uploads/${img}`, title, shortDesc, category, content, tag })
    // console.log({ infoBlog });
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

route.post('/update/:blogID', upload.single('image'), async (req, res) => {
    let { blogID } = req.params;
    let infoBlog;
    if (req.file) {
        let img = req.file.filename;
        let { title, content, category, shortDesc, tag } = req.body;
        infoBlog = await BLOG_MODEL.update({ blogID, image: `/uploads/${img}`, title, content, category, shortDesc, tag });

    }else{
        let { title, content, category, shortDesc, tag } = req.body;
        infoBlog = await BLOG_MODEL.update({ blogID, title, content, category, shortDesc, tag });
    }
    res.json(infoBlog)
})

route.post('/update-status/:blogID', async (req, res) => {
    let { blogID } = req.params;
    let { status } = req.body;
    let infoBlog = await BLOG_MODEL.updateStatus({ blogID, status });
    res.json(infoBlog)
})

route.get('/list-post-trending', async (req, res) => {
    let listBlogTrending = await BLOG_MODEL.getListTrending();
    res.json(listBlogTrending)
})

route.get('/:slug', async (req, res) => {
    let { slug } = req.params;
    
    let infoBlog = await BLOG_MODEL.getInfoBySlug({ slug, views: 1 });
   
    renderToView(req, res, 'pages/info-post', {
        infoBlog: infoBlog.data,
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