const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;
const mongoDbURL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/BECHYU";
mongoose.connect(mongoDbURL, { useNEWUrlParser: true });

var db = mongoose.connection;

// EXPRESS SPECIFIC STUFF
app.use("/static", express.static("static")); // For serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// PUG SPECIFIC STUFF
app.set("view engine", "pug"); // Set the template engine as pug
app.set("views", path.join(__dirname, "views")); // Set the views directory

//for registration
const SignupSchema = new mongoose.Schema({
  Name: String,
  Username: String,
  Email: String,
  Phone: String,
  Password: String,
  Cpassword: String,
});

//For issues
const ContactSchema = new mongoose.Schema({
  Name: String,
  Phone: String,
  Email: String,
  Address: String,
  Concern: String,
});

//for selling
const SellerSchema = new mongoose.Schema({
  Name: String,
  BrandsName: String,
  Phone: String,
  Email: String,
  Address: String,
  ProductsName: String,
  Type: String,
  Age: Number,
  Image: String,
  Cost: Number,
});

const Signupdetails = mongoose.model("Signupdetails", SignupSchema);
const Contactdetails = mongoose.model("Contactdetails", ContactSchema);
const Sellerdetails = mongoose.model("Sellerdetails", SellerSchema);

// ENDPOINTS

//home page before login
app.get("/", (req, res) => {
  try {
    res.status(200).sendFile("index.html", { root: __dirname });
  } catch (e) {
    return console.log(e);
  }
});

//home page after login
app.get("/home", (req, res) => {
  try {
    res.status(200).sendFile("index1.html", { root: __dirname });
  } catch (e) {
    return console.log(e);
  }
});

//products
app.get("/products", async (req, res) => {
  res.status(200).sendFile("index2.html", { root: __dirname });
});
app.get("/details", async (req, res) => {
  res.status(200).sendFile("detail.html", { root: __dirname });
});
//seller
app.get("/seller", (req, res) => {
  res.status(200).render("seller.pug");
});
app.post("/seller", (req, res) => {
  try {
    const email = req.body.Email;
    const phone = req.body.Phone;
    const name = req.body.Name;
    const address = req.body.Address;
    const image = req.body.Image;
    const cost = req.body.Cost;
    const age = req.body.Age;
    const productsname = req.body.ProductsName;
    const type = req.body.Type;
    if (
      email === "" ||
      phone === "" ||
      name === "" ||
      address === "" ||
      image === "" ||
      cost === "" ||
      productsname === "" ||
      type === "" ||
      age === ""
    ) {
      const params = {
        Fill: "Fill the required Details",
      };
      res.status(200).render("seller.pug", params);
    } else if (phone.length < 10) {
      const params = {
        Fill: "Phone number is invalid",
      };
      res.status(200).render("seller.pug", params);
    } else {
      const myData = new Sellerdetails(req.body);
      myData.save((err, k) => {
        if (err) {
          return console.log("err");
        } else {
          const params = {
            Fill: "Your product's data has been saved. Buyer will contact you soon!",
          };
          return res.status(200).render("contact.pug", params);
        }
      });
    }
  } catch (error) {
    return console.log("lawda");
  }
});

//login
app.get("/login", (req, res) => {
  res.status(200).render("login.pug");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.Email;
    const password = req.body.Password;
    if (email === "" || password === "") {
      const params = {
        Fill: "Fill the required Details",
      };
      res.status(200).render("login.pug", params);
    } else {
      const loginEmail = await Signupdetails.findOne({
        Email: email,
      });
      const loginPassword = await Signupdetails.findOne({
        Password: password,
      });
      if (loginEmail === null) {
        const params = {
          Fill: "Email id is not registered",
        };
        res.status(200).render("login.pug", params);
      } else if (loginEmail.Password !== password) {
        const params = {
          Fill: "Invalid credentials",
        };
        res.status(200).render("login.pug", params);
      } else {
        res.status(200).sendFile("index1.html", { root: __dirname });
      }
    }
  } catch (error) {
    return console.log("lawda");
  }
});

//signup
app.get("/signup", (req, res) => {
  res.status(200).render("signup.pug");
});

app.post("/signup", async (req, res) => {
  try {
    const email = req.body.Email;
    const phone = req.body.Phone;
    const name = req.body.Name;
    const password = req.body.Password;
    const cpassword = req.body.Cpassword;
    if (
      email === "" ||
      phone === "" ||
      name === "" ||
      password === "" ||
      cpassword === ""
    ) {
      const params = {
        Fill: "Fill the required Details",
      };
      res.status(200).render("signup.pug", params);
    } else if (password !== cpassword) {
      const params = {
        Fill: "Passwords are different",
      };
      res.status(200).render("signup.pug", params);
    } else if (phone.length < 10) {
      const params = {
        Fill: "Phone number is invalid",
      };
      res.status(200).render("signup.pug", params);
    } else {
      const registeredEmail = await Signupdetails.findOne({
        Email: email,
      });
      const registeredPhone = await Signupdetails.findOne({
        Phone: phone,
      });
      if (registeredEmail === null && registeredPhone === null) {
        const myData = new Signupdetails(req.body);
        myData.save((err, k) => {
          if (err) {
            return console.log("err");
          } else {
            const params = {
              Fill: "You have been registered. Try Login Now!",
            };
            return res.status(200).render("login.pug", params);
          }
        });
      } else {
        const params = {
          Fill: "Already registered! Try Log in",
        };
        res.status(200).render("signup.pug", params);
      }
    }
  } catch (error) {
    return console.log("lawda");
  }
});

//Contact

app.post("/contact", async (req, res) => {
  try {
    const email = req.body.Email;
    const phone = req.body.Phone;
    const name = req.body.Name;
    const address = req.body.Address;
    const concern = req.body.Concern;
    if (
      email === "" ||
      phone === "" ||
      name === "" ||
      address === "" ||
      concern === ""
    ) {
      const params = {
        Fill: "You did not fill the required Details. Please! fill the form again",
      };
      res.status(200).render("contact.pug", params);
    } else if (phone.length < 10) {
      const params = {
        Fill: "Phone number is invalid",
      };
      res.status(200).render("contact.pug", params);
    } else {
      const myData = new Contactdetails(req.body);
      myData.save((err, k) => {
        if (err) {
          return console.log("err");
        } else {
          const params = {
            Fill: "We will reach you soon",
          };
          return res.status(200).render("contact.pug", params);
        }
      });
    }
  } catch (error) {
    return console.log("lawda");
  }
});
app.get("/:Type", async (req, res) => {
  const type = req.params.Type;
  const Mobiles = await Sellerdetails.find({
    Type: type,
  });
  res.status(200).send(Mobiles);
});
app.get("/details/:id", async (req, res) => {
  const id = req.params.id;
  const details = await Sellerdetails.find({
    _id: id,
  });
  res.status(200).send(details);
});
app.get("/name/:ProdutsName", async (req, res) => {
  const id = req.params.ProdutsName;
  const details = await Sellerdetails.find({
    ProductsName: id,
  });
  res.status(200).send(details);
});
app.get("/brands/:BrandsName", async (req, res) => {
  const id = req.params.BrandsName;
  const details = await Sellerdetails.find({
    BrandsName: id,
  });
  res.status(200).send(details);
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

// app.get("/log", async (req, res) => {
//   const registeredEmail = await Signupdetails.find();
//   res.status(200).send(registeredEmail);
// });
