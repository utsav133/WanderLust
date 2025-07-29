// if (process.env.NODE_ENV != "production") {
//   require("dotenv").config();
// }
// // app.js ya index.js ke top pe
// // import dotenv from 'dotenv';
// // dotenv.config();

// console.log("Mapbox token:", process.env.MAP_TOKEN);

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");
// const initDB = require("./init/index.js");

// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");

// app.use(express.static(path.join(__dirname, "/public")));
// app.engine("ejs", ejsMate);
// app.use(methodOverride("_method"));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));

// const mongoUrl = process.env.ATLASDB_URL;
// await mongoose.connect(mongoUrl);

// // main()
// //   .then(() => {
// //     console.log("connected to DB");
// //   })
// //   .catch((err) => {
// //     console.log(err);
// //   });

// // async function main() {
// //   await mongoose.connect(mongoUrl);

// //   const Listing = require("./models/listing.js");

// // Listing.find().then((listings) => {
// //   console.log("Listings in DB:", listings);
// // });

// //}
// store.on("error", (err) => {
//   console.log("ERROR in MONGO SESSION STORE", err);
// });

// // ✅ main() handles DB connection + listing log + initDB
// async function main() {
//   try {
    
//     console.log("✅ Connected to DB");

//     const Listing = require("./models/listing.js");
//     const listings = await Listing.find({});
//     console.log("📦 Listings in DB:", listings);

//     initDB(); // ✅ Optional - comment after first time

//   } catch (err) {
//     console.error("❌ DB connection error:", err);
//   }
// }
// main();



// const store = MongoStore.create({
//   mongoUrl: mongoUrl,
//   crypto: {
//     secret: process.env.SECRET,
//   },
//   touchAfter: 24 * 2600,
// });

// store.on("error", () => {
//   console.log("ERROR in MONGO SESSION STORE", err);
// });

// const sessionOptions = {
//   store,
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//   },
// };

// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currUser = req.user;
//   next();
// });

// app.get("/", (req, res) => {
//   res.redirect("/listings");
// });

// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/", userRouter);

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Some Error Occured!" } = err;
//   res.status(statusCode).render("./listings/error.ejs", { message });
// });

// app.listen(8080, () => {
//   console.log("Listening on port 8080");
   
// });
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("Mapbox token:", process.env.MAP_TOKEN);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const initDB = require("./init/index.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const mongoUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some Error Occurred!" } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
});

// ✅ Only here — connect DB and init
async function main() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to DB");

    const Listing = require("./models/listing.js");
    const listings = await Listing.find({});
    console.log("📦 Listings in DB:", listings);

    await initDB(); // Seed only if needed
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }

  app.listen(8080, () => {
    console.log("🚀 Server running on port 8080");
  });
}

main();
