const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');
const campgrounds = require('../controllers/campgrounds')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.route('/:id')
.get( catchAsync(campgrounds.showCampground))
.put( isLoggedIn, validateCampground, catchAsync(campgrounds.updateCampground))
.delete( isLoggedIn, catchAsync(campgrounds.deleteCampground));


router.get('/:id/edit', isLoggedIn, catchAsync(campgrounds.renderEditForm));





router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Take care!");
    res.redirect('/campgrounds');
});

module.exports = router;