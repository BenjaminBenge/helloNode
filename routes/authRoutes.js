const express = require("express");
const router = express.Router();
const passport = require("passport");

//import models
const Signup = require("../models/SignUp");


router.get("/userSignUp", (req, res) => {
  res.render("signUp");
});
//populating the DB
router.post("/userSignUp", async (req, res) => {
  try {
    const user = new Signup(req.body);
    let existingUser = await Signup.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      return res.status(400).send("Not registered, email already in use");
    } else {
      await Signup.register(user, req.body.password, (error) => {
        if (error) {
          throw error;
        }
        res.redirect("/login");
      });
    }

    console.log(user);
  } catch (error) {
    res.status(400).render("signUp");
    console.log(error);
  }
});

//adding users List Route
// router.get("/usersTable", (req, res) => {
//   res.render("userList" );
// });


//getting the Data from a DB to a table

router.get("/usersTable", async (req, res) => {
  try {
    let users = await Signup.find().sort({$natural:-1});
    res.render("userList", {
      signups: users,



    });
  } catch (error) {
    res.status(400).send("unable to find items in the database");
  }
});
// console.log(users)
// console.log(signups)


router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    console.log(req.body);
    req.session.user = req.user;
    if (req.user.role === "Manager") {
      res.redirect("/managerDash");
    } else if (req.user.role === "salesAgent") {
      res.redirect("/seeProducts");
    } else if (req.user.role === "Director") {
      res.redirect("/directorDash");
    }else{
      res.send("You do not have any role in the system ")
    }
  }
);

router.get("/logout", (req, res) => {
  
  if(req.session){
   req.session.destroy((error) =>{
    if(error) {
      return res.status(500).send(error ,"Error logging out")
    }
    res.redirect("/")
   }) 
  }
})

router.get("/", (req, res) => {
  res.render("index");
});



module.exports = router;
