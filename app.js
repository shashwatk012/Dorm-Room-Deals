require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
const multer = require("multer");
const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;
const mongoDbURL =
  process.env.MONGODB_URL ||
  `mongodb://localhost:27017/${process.env.DATABASE}`;
mongoose.connect(mongoDbURL, { useNEWUrlParser: true });

var db = mongoose.connection;

// EXPRESS SPECIFIC STUFF
app.use("/static", express.static("static")); // For serving static files
// app.use("./public/data/uploads", express.static("static"));
app.use(cookieParser());

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
  Age: String,
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
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, "mynameisxyzemailidxyzphonenumberxyz");
    res.status(200).sendFile("index1.html", { root: __dirname });
  } catch (e) {
    res.status(200).sendFile("index.html", { root: __dirname });
  }
});

//home page after login
app.get("/home", async (req, res) => {
  try {
    res.status(200).sendFile("index1.html", { root: __dirname });
  } catch (e) {
    return console.log(e);
  }
});
app.get("/loginDetails", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (token === undefined) {
      res.status(200).send({ Name: "Error" });
    } else {
      const verify = jwt.verify(token, "mynameisxyzemailidxyzphonenumberxyz");
      const user = await Signupdetails.findOne({ _id: verify._id });
      res.status(200).send(user);
    }
  } catch (e) {
    return console.log(e);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, "mynameisxyzemailidxyzphonenumberxyz");
    const user = await Signupdetails.findOne({ _id: verify._id });
    const params = {
      Fill: user.Name,
      Fill1: user.Name,
      Fill2: user.Username,
      Fill3: user.Email,
      Fill4: user.Phone,
    };
    res.status(200).render("profile.pug", params);
  } catch (e) {
    res.status(200).sendFile("index.html", { root: __dirname });
  }
});

//products
app.get("/products", async (req, res) => {
  res.status(200).sendFile("index2.html", { root: __dirname });
});
app.get("/details", async (req, res) => {
  res.status(200).sendFile("detail.html", { root: __dirname });
});

//signup
app.get("/signup", (req, res) => {
  res.status(200).render("signup.pug");
});

app.post("/signup", async (req, res) => {
  try {
    const email = req.body.Email;
    const Username = req.body.Username;
    const phone = req.body.Phone;
    const name = req.body.Name;
    const password = req.body.Password;
    const cpassword = req.body.Cpassword;
    if (
      email === "" ||
      phone === "" ||
      name === "" ||
      password === "" ||
      cpassword === "" ||
      Username === ""
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
    } else if (phone.length < 10 && phone.length > 11) {
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
        const token = await myData.tokengenerator();
        // res.cookie("jwt", token, {
        //   expires: new Date(Date.now() + 30000),
        //   httpOnly: true,
        // });
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 86400000),
          httpOnly: true,
        });
        // console.log(cookie);
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
          Fill: "Phone number or Email already registered! Try Log in",
        };
        res.status(200).render("signup.pug", params);
      }
    }
  } catch (error) {
    return console.log("lawda");
  }
});
//seller
app.get("/seller", (req, res) => {
  res.status(200).render("seller.pug");
});
// const upload = multer({ dest: "./public/data/uploads/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static/public/images/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  // limits: {
  //   fieldSize: 1024 * 1024 * 3,
  // },
});
app.post("/seller", upload.single("uploaded_file"), async function (req, res) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  console.log(req.file, req.body);
  const email = req.body.Email;
  const phone = req.body.Phone;
  const name = req.body.Name;
  const address = req.body.Address;
  const image = req.file.filename;
  console.log(image);
  const cost = req.body.Cost;
  const age = req.body.Age;
  const productsname = req.body.ProductsName;
  const type = req.body.Type;
  const brandsName = req.body.BrandsName;
  if (
    email === "" ||
    phone === "" ||
    name === "" ||
    address === "" ||
    cost === "" ||
    productsname === "" ||
    type === "" ||
    age === "" ||
    brandsName === ""
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
    const myData = new Sellerdetails({
      Name: name,
      BrandsName: brandsName,
      Phone: phone,
      Email: email,
      Address: address,
      ProductsName: productsname,
      Type: type,
      Age: age,
      Image: image,
      Cost: cost,
    });
    const data = await myData.save();
    const params = {
      Fill: "Your data has been saved successfully! Buyer will contact you soon",
    };
    res.status(200).render("contact.pug", params);
  }
});
// app.post("/seller", (req, res) => {
//
// });
app.get("/logout", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, "mynameisxyzemailidxyzphonenumberxyz");
    const user = await Signupdetails.findOne({ _id: verify._id });
    res.clearCookie("jwt");
    user.tokens = user.tokens.filter((currentCookie) => {
      return currentCookie.token !== token;
    });
    await user.save();
    res.status(200).render("login.pug");
  } catch (err) {
    res.status(200).render("login.pug");
  }
});

//login
app.get("/login", (req, res) => {
  res.status(200).render("login.pug");
});
app.get("/log-in", (req, res) => {
  const params = {
    Fill: "Session-Expired! Login again",
  };
  res.status(200).render("login.pug", params);
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.Email;
    const password = req.body.Password;
    const check = req.body.checkbox;
    if (email === "" || password === "") {
      const params = {
        Fill: "Fill the required Details",
      };
      res.status(200).render("login.pug", params);
    } else {
      const loginEmail = await Signupdetails.findOne({
        Email: email,
      });
      if (loginEmail === null) {
        const params = {
          Fill: "Email id is not registered",
        };
        res.status(200).render("login.pug", params);
      } else if (!(await bcrypt.compare(password, loginEmail.Password))) {
        const params = {
          Fill: "Invalid credentials",
        };
        res.status(200).render("login.pug", params);
      } else {
        const token = await loginEmail.tokengenerator();
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 86400000),
          httpOnly: true,
        });
        res.status(200).sendFile("index1.html", { root: __dirname });
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
app.get("/ProdutsName", async (req, res) => {
  const id = req.params.ProdutsName;
  const details = await Sellerdetails.find();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).send(details);
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

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

// app.get("/log", async (req, res) => {
//   const registeredEmail = await Signupdetails.find();
//   res.status(200).send(registeredEmail);
// });
