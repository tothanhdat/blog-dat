const route             = require('express').Router();
const checkActive       = require('../utils/checkActive');
const { renderToView }  = require('../utils/childRouting');
const USER_MODEL        = require('../models/user');

//TRANG ĐĂNG NHẬP
route.post('/login', async (req, res) => {
    let { username, password } = req.body;
    let infoUser = await USER_MODEL.signIn(username, password);

    if(!infoUser.error){
        req.session.token = infoUser.data.token; //gán token đã tạo cho session
        req.session.user = infoUser.data.infoUser;
        req.user = infoUser.data.infoUser;
    }

    return res.json(infoUser)
    //renderToView(req, res, 'pages/dashboard-admin', { infoUser: infoUser.data })
})

route.post('/register', async (req, res) => {
    let { username, password } = req.body;
    let infoUser = await USER_MODEL.register(username, password);
    res.json(infoUser)
});

module.exports = route;
