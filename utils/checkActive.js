const { sign, verify } = require('../utils/jwt')
module.exports = async function (req, res, next) {
    let { token } = req.session;

    if (!token)
        return res.redirect('/login');

    let checkRole = await verify(token);
    if (checkRole.data.role == 1)
        return res.redirect('/dashboard');
    next();
}