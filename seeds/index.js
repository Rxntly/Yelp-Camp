const express = require('express');
const cities = require("./cities");
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground'); 
const { descriptors, places } = require('./seedHelpers'); 

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
   await Campground.deleteMany({});
   for(let x = 0; x < 50; x++){
      const random1000 = Math.floor(Math.random() * 1000);
      const camp = new Campground({
         location: `${cities[random1000].city}, ${cities[random1000].state}`,
         title: `${sample(descriptors)} ${sample(places)}`
      });
      await camp.save();
   }
}

seedDB().then(() => {
    mongoose.connection.close();
});