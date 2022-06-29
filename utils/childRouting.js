const jwt               = require('./jwt.js');
const moment            = require('moment');

const BLOG_MODEL        = require('../models/blog');
const { CATEGORY }      = require('../constants/config');

let renderToView = async function(req, res, view, data) {
    let { token } = req.session;

    if(token) {
        let user = await jwt.verify(token);
        data.infoUser = user.data;
        
    } else {
        data.infoUser = undefined;
    }
    
    let listBlog                = await BLOG_MODEL.getList({});
    let totalViews              = await BLOG_MODEL.countViews({});
    data.moment                 = moment;
    data.listBlog               = listBlog.data;
    data.CATEGORY               = CATEGORY;
    data.totalBlog              = listBlog.data.length;
    data.totalViews             = totalViews.data;

    return res.render(view, data);
}
exports.renderToView = renderToView;