const route                     = require('express').Router();
const checkActive               = require('../utils/checkActive');
const { renderToView }          = require('../utils/childRouting');
const USER_MODEL                = require('../models/user');
const REGISTER_ACCOUNT_MODEL    = require('../models/register-customer');

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

//API đăng ký account
route.post('/register-customer', async (req, res) => {
    let { name, email, questionContent, blogID } = req.body;
    let infoCustomer = await REGISTER_ACCOUNT_MODEL.register({ name, email, questionContent, blogID });
    res.json(infoCustomer)
});

//API lấy danh sách account đăng ký
route.get('/list-customer', async (req, res) => {
    let listCustomer = await REGISTER_ACCOUNT_MODEL.getList();
    res.json(listCustomer)
});

//API gửi email
route.post('/send-email', async (req, res) => {
    let { title, content } = req.body;
    let actionSendEmail = await REGISTER_ACCOUNT_MODEL.sendEmail({ title, content });
    res.json(actionSendEmail)
});

module.exports = route;
