const dotenv = require("dotenv");
dotenv.config();
const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const expressSession    = require('express-session');
const path              = require('path')

const { renderToView }  = require('./utils/childRouting');
const checkActive       = require('./utils/checkActive');

const BLOG_ROUTER       = require('./routes/blog');
const CATEGORY_ROUTER   = require('./routes/category');
const USER_ROUTER       = require('./routes/user');
const ADMIN_ROUTER      = require('./routes/admin');
const LEARNING_ROUTER   = require('./routes/learning');
const TOOLS_ROUTER      = require('./routes/tools');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

var options = {
    etag: false,
    // extensions: ['htm', 'html'],
    // index: false,
    // maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
    //   res.set({
    //     'x-timestamp': Date.now(),
    //     'dat': 'hi',
    //     'Cache-Control': 'public, max-age: 3600'
    //   })
        res.setHeader("Cache-Control","max-age=" + 365 * 24 * 60 * 60);//Cache for a year
        res.removeHeader("Pragma");
        res.removeHeader("Expires");
    }
  }
  
app.use(express.static('public', options))

app.use(expressSession({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret1212dsds', 
    cookie: { maxAge: 10 * 60 * 1000 * 100 }
}));

app.use('/blog', BLOG_ROUTER);
app.use('/category', CATEGORY_ROUTER);
app.use('/user', USER_ROUTER);
app.use('/admin', ADMIN_ROUTER);
app.use('/learning', LEARNING_ROUTER);
app.use('/tools', TOOLS_ROUTER);


app.get('/', async (req, res) => {
    renderToView(req, res, 'pages/home.ejs', {})
});

app.get('/about-me', async (req, res) => {
    renderToView(req, res, 'pages/about-me.ejs', {})
});

//LOGIN
app.get('/login', async (req, res) => {
    renderToView(req, res, 'dashboard/login.ejs', {})
});

//LOGIN
app.get('/admin', async (req, res) => {
    res.redirect('/login');
});

//DASHBOARD
app.get('/dashboard', checkActive, async (req, res) => {
    renderToView(req, res, 'dashboard/home.ejs', {})
});

//LOGOUT
app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/login');
});

//Dẫn đến page 404
// app.use(function(req, res, next){
//     res.status(404).render('pages/page-404', {title: "Sorry, page not found"});
// });

const PORT = process.env.PORT || 3000;

const uri = 'mongodb://localhost/blogtodat';

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
});

// mongoose.connect(process.env.DATABASE, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => {
//     console.log("DB CONNECTED");
// })


//app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
