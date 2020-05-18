const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const ShortUrl  = require('./models/shorturls');
require('dotenv').config()
const portNum = process.env.PORT || 5000;
const options = {
    useNewUrlParser : true ,
    useUnifiedTopology: true
};
// ejs middleware
app.use(expressLayout);
app.set('view engine', 'ejs')

//body-parser middleware
app.use(express.urlencoded({extended: false}))

//mongo middleware
mongoose.connect(process.env.MONGO_URI, options).then(()=>{
    console.log('MongoDb connected');
}).catch((err)=>{
    console.log(err);
});
mongoose.Promise = global.Promise

//routes
app.get('/', async (req, res)=>{
    const urls = await ShortUrl.find();
    res.render('main', {urls});
});

app.post('/shorturls', async (req, res)=>{
    await ShortUrl.create({
        fullUrl: req.body.fullUrl
    })
    res.redirect('/');
});

app.get('/:shorturl', async (req, res)=>{
    const url = await ShortUrl.findOne({shortUrl:req.params.shorturl});
    if(!url){
       return res.sendStatus(404)
    }
    url.clicks+=1
    url.save();
    res.redirect(url.fullUrl);
});

// server setup
app.listen(portNum, ()=>{
    console.log(`Server up and running at port ${portNum}!!!`);
});
