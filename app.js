const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground'); 
const methodOveride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOveride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds }); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds' , async (req,res,next)=>{
    const campground= new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})


app.get('/campgrounds/:id',catchAsync( async(req,res,) => {
    const campground=await Campground.findById(req.params.id)
    console.log('campgrounds',campground)
    res.render('campgrounds/show', {campground});
}))

app.get('/campgrounds/:id/edit', async(req,res)=>{
    const campground=await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground});
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.put('/campgrounds/:id', async(req,res,) => {
const{id}=req.params;
const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async(req,res)=>{
    const {id}= req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not found', 404))
})

app.use((req, res, next) => {
    const err = new ExpressError('Page Not Found', 404);
    next(err);
});

 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(3030, () => { 
    console.log('serving on port 3030');
});