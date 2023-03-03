const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SignupSchema = new mongoose.Schema({
  Name: { type: String, required: [true, "Please enter your Name"] },
  Username: {
    type: String,
    required: [true, "Please enter your Username"],
  },
  Email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: [true, "Email is already registered"],
  },
  Phone: {
    type: String,
    required: [true, "Please enter your Mobile Phone"],
    unique: [true, "Phone Number is already registered"],
    minlength: [10, "Invalid Phone Number"],
    maxlength: [10, "Invalid Phone Number"],
  },
  Password: {
    type: String,
    required: [true, "Please enter your Password"],
    minlength: [8, "Minimum length of Password should be 8"],
  },
  Cpassword: {
    type: String,
    required: [true, "Please enter your Comfirm Password"],
    minlength: [8, "Minimum length should be 8"],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

SignupSchema.methods.tokengenerator = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      "mynameisxyzemailidxyzphonenumberxyz"
    ); //we could use the secretkey as a env file but heroku does not support
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (e) {
    return console.log(e);
  }
};
//console.log(process.env.DATABASE);

SignupSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 10);
    this.Cpassword = await bcrypt.hash(this.Cpassword, 10);
  }
  next();
});
//For issues
const ContactSchema = new mongoose.Schema({
  Name: { type: String, required: [true, "Please enter your Name"] },
  Email: {
    type: String,
    required: [true, "Please enter your Email"],
  },
  Phone: {
    type: String,
    required: [true, "Please enter your Mobile Phone"],
    minlength: [10, "Invalid Phone Number"],
    maxlength: [10, "Invalid Phone Number"],
  },
  Address: { type: String, required: [true, "Please enter your Address"] },
  Concern: { type: String, required: [true, "Please enter your Concern"] },
});

const AddtocartSchema = new mongoose.Schema({
  Name: String,
  idi: String,
});

//for selling
const SellerSchema = new mongoose.Schema({
  Name: { type: String, required: [true, "Please enter your Name"] },
  BrandsName: {
    type: String,
    required: [true, "Please enter your BrandsName"],
  },
  Phone: {
    type: String,
    required: [true, "Please enter your Mobile Phone"],
    minlength: [10, "Invalid Phone Number"],
    maxlength: [10, "Invalid Phone Number"],
  },
  Email: {
    type: String,
    required: [true, "Please enter your Email"],
  },
  Address: { type: String, required: [true, "Please enter your Address"] },
  ProductsName: {
    type: String,
    required: [true, "Please enter your ProductsName"],
  },
  Type: { type: String, required: [true, "Please enter your Type"] },
  Age: { type: String, required: [true, "Please enter your Age"] },
  Image: { type: String, required: [true, "Please enter your Image"] },
  Cost: { type: String, required: [true, "Please enter your Cost"] },
});

const Signupdetails = mongoose.model("Signupdetails", SignupSchema);
const Contactdetails = mongoose.model("Contactdetails", ContactSchema);
const Sellerdetails = mongoose.model("Sellerdetails", SellerSchema);
const Addtocart = mongoose.model("Addtocart", AddtocartSchema);

module.exports = { Signupdetails, Contactdetails, Sellerdetails, Addtocart };
