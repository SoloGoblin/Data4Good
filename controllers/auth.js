const express = require('express'),
  router = express.Router();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const KEYS = require('../config/keys.json');
//keeping our secrets out of our main application is a security best practice
//we can add /config/keys.json to our .gitignore file so that we keep it local/private

let userProfile; //only used if you want to see user info beyond username
const User = require("../models/profile_model")

router.use(session({
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 600000 //600 seconds of login time before being logged out
  },
  secret: KEYS["session-secret"]
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: KEYS["google-client-id"],
    clientSecret: KEYS["google-client-secret"],
    callbackURL: "http://localhost:3000/auth/google/callback"
    //todo: port==process.env.PORT? :
  },
  function (accessToken, refreshToken, profile, done) {
    userProfile = profile; //so we can see & use details form the profile

    return done(null, userProfile);
  }
));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/*
  This triggers the communication with Google
*/
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['email']
  }));

/*
  This callback is invoked after Google decides on the login results
*/

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/error?code=401'
  }),
  function (request, response) {
    //request.user=userProfile
    ///load the user data from users json
    /*
    if (User.loadProfile(userProfile.id) == undefined) {
      response.redirect("/")////create user page
    } else {
      request.userDetails = User.loadProfile(userProfile.id)
      
    }*/
    User.getProfile(request.user, request, response, cb)



  });

function cb(request, response, profile) {

  if (profile.uid == "107968319163821151267") {
    profile.role = "rootadmin"
  }

  request.user.profile = profile

  response.redirect('/');
}



router.get("/auth/logout", (request, response) => {

  request.logout((err) => {

    if (err) {
      console.log(err)
      response.send("Error happened")
    }
    response.redirect('/');

  });

});

module.exports = router;