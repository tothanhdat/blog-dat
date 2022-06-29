require("dotenv").config();
const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const expressSession    = require('express-session');

const { renderToView }  = require('./utils/childRouting');
const checkActive       = require('./utils/checkActive');
const BLOG_MODEL        = require('./models/blog');

const BLOG_ROUTER       = require('./routes/blog');
const CATEGORY_ROUTER   = require('./routes/category');
const USER_ROUTER       = require('./routes/user');
const { CATEGORY }      = require('./constants/config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(expressSession({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret1212dsds', 
    cookie: { maxAge: 10 * 60 * 1000 * 100 }
}));

app.use('/blog', BLOG_ROUTER);
app.use('/category', CATEGORY_ROUTER);
app.use('/user', USER_ROUTER);

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

//DASHBOARD
app.get('/dashboard', checkActive, async (req, res) => {
    renderToView(req, res, 'dashboard/home.ejs', {})
});

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
