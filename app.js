require("dotenv").config();
const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const moment            = require('moment');

const BLOG_MODEL        = require('./models/blog');

const BLOG_ROUTER       = require('./routes/blog');
const CATEGORY_ROUTER   = require('./routes/category');
const { CATEGORY }      = require('./constants/config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/blog', BLOG_ROUTER);
app.use('/category', CATEGORY_ROUTER);

app.get('/', async (req, res) => {
    let listBlog = await BLOG_MODEL.getList({});
    res.render('pages/home.ejs', {
        listBlog: listBlog.data, 
        moment, 
        CATEGORY 
    })
});

app.get('/about-me', async (req, res) => {
    res.render('pages/about-me.ejs')
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
