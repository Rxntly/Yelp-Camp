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
    for (let x = 0; x < 50; x++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: '66ced6de5abc3a3850adc320', 
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
             image: "https://picsum.photos/200/300",
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, autem. Corrupti non assumenda culpa minima inventore, nisi facilis consectetur at, est corporis id ab rerum asperiores! Veniam natus quae aliquam?',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});