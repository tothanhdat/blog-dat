const route             = require('express').Router();
const REGISTER_CUSTOMER_MODEL = require('../models/register-customer');
const { renderToView }  = require('../utils/childRouting');

route.get('/list-comment', async (req, res) => {
    let listComment = await REGISTER_CUSTOMER_MODEL.getList();
    renderToView(req, res, 'dashboard/list-comment', {
        listComment: listComment.data, 
    })
})

module.exports = route;