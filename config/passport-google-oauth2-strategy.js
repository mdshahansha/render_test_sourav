import passport from "passport";
import passportGoogleOAuth from "passport-google-oauth";
const googleStrategy = passportGoogleOAuth.OAuth2Strategy;
import crypto from "crypto";
import User from "../models/user.js";
// import env from "./environment.js";

// tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
  {
       clientID:"289979441456-k3mrpdv7fkaf4bvlimuharcnba5m0s3u.apps.googleusercontent.com",
      clientSecret:"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",
      callbackURL:"http://localhost:8000/users/auth/google/callback",
    },

    function (accessToken, refreshToken, profile, done) {
      // find a user
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("error in google strategy-passport", err);
          return;
        }
        console.log(accessToken, refreshToken);
        console.log(profile);

        if (user) {
          // if found, set this user as req.user
          return done(null, user);
        } else {
          // if not found, create the user and set it as req.user
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                console.log(
                  "error in creating user google strategy-passport",
                  err
                );
                return;
              }

              return done(null, user);
            }
          );
        }
      });
    }
  )
);

export default passport;
