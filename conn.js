const express = require("express");
const mongoose = require("mongoose");

const mongoDbURL =
  process.env.MONGODB_URL ||
  `mongodb://localhost:27017/${process.env.DATABASE}`;

mongoose
  .connect(mongoDbURL, { useNEWUrlParser: true })
  .then(() => {
    console.log("connection successful");
  })
  .catch((e) => {
    console.log(e);
  });

var db = mongoose.connection;
