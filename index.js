const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require('express-session');
dotenv.config();
const passport = require("passport");
const { loginCheck } = require("./auth/passport");
loginCheck(passport);


//socketIO
const http = require('http').Server(app);
const io = require('socket.io')(http);


// Mongo DB conncetion
const database = process.env.MONGOLAB_URI;
console.log(database);
mongoose
    .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("DB CONNEXION"))
    .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static('public'));
//BodyParsing
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'mysecret',
    saveUninitialized: true,
    resave: true
}));


app.use(passport.initialize());
app.use(passport.session());
//Routes
app.use("/", require("./routes/login"));

io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});

const PORT = process.env.PORT || 4111;

http.listen(PORT, console.log("Server has started at port " + PORT));