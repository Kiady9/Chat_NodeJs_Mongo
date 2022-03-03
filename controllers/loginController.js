const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//For Register Page
const registerView = (req, res) => {
    res.render("register", {});
};

//Post Request for Register

const registerUser = (req, res) => {
    const { name, hobby, age, email, location, password, confirm } = req.body;

    if (!name ||!hobby || !age || !email || !password || !confirm) {
        console.log("Fill empty fields");
    }

    //Confirm Passwords

    if (password !== confirm) {
        console.log("Password must match");
    } else {
        //Validation
        User.findOne({ email: email }).then((user) => {
            if (user) {
                console.log("email exists");
                res.render("register", {
                    name,
                    hobby,
                    age,
                    email,
                    password,
                    confirm,
                });
            } else {
                //Validation
                const newUser = new User({
                    name,
                    hobby,
                    age,
                    email,
                    location,
                    password,
                });
                //Password Hashing
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;
                        newUser
                            .save()
                            .then(res.redirect("/login"))
                            .catch((err) => console.log(err));
                    })
                );
            }
        });
    }
};

// For View
const loginView = (req, res) => {
    res.render("login", {});
};

//Logging in Function

const loginUser = (req, res) => {




    const { email, password } = req.body;

    //Required
    if (!email || !password) {
        console.log("Please fill in all the fields");
        res.render("login", {
            email,
            password,
        });
    } else {
        passport.authenticate("local", {
            successRedirect: "/dashboard",
            failureRedirect: "/login",
            failureFlash: true,
        })(req, res);


    }


};


const logOut = (req, res) => {
    console.log('logout en cours');
    req.logOut() // IMPORTANT ! Propre à passport, impératif à la déconnexion
    var logoutMSg = 1;
    res.render('login', { logoutMSg: logoutMSg });



};

module.exports = {
    registerView,
    loginView,
    registerUser,
    loginUser,
    logOut,
};