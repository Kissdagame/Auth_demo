// setup for app allows us to use the dependencies 
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user'),
    port = 3000;

mongoose.connect('mongodb://localhost/auth_demo_app', { useNewUrlParser: true });


// allows us to uses EJS files without needing to write ejs 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
    secret: 'This is going to be a good trip',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};


// Routes

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/secret', isLoggedIn, (req, res) => {
    res.render('secret');
});

// Auth routes

// shows sign up form
app.get('/register', (req, res) => {
    res.render('register');
});

// Handling user sign up
app.post('/register', (req, res) => {

    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/secret');

        });
    });
});

// Login routes
// render login form

app.get('/login', (req, res) => {
    res.render('login');
});

// Login post route
// login  logic

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), (req, res) => {});

// logout route

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Starts the server
app.listen(port, () => {
    console.log('Server is up and running');
});