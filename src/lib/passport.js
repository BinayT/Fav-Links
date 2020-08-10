const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const pool = require("../database");
const helpers = require("../lib/helpers");

passport.use(
  "local.signin",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, next) => {
      const rows = await pool.query("SELECT * FROM users WHERE username = ? ", [
        username,
      ]);
      if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(
          password,
          user.password
        );
        if (validPassword) {
          next(null, user, req.flash("success", "Welcome " + user.username));
        } else {
          next(null, false, req.flash("message", "Incorrect password"));
        }
      } else {
        return next(
          null,
          false,
          req.flash("message", "User doesn't exist. Please try again")
        );
      }
    }
  )
);

passport.use(
  "local.signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, next) => {
      const { fullname } = req.body;
      const newUser = {
        username,
        password,
        fullname,
      };
      newUser.password = await helpers.encryptPassort(password);
      const result = await pool.query("INSERT INTO users SET ?", [newUser]);
      newUser.id = result.insertId;
      return next(null, newUser);
    }
  )
);

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser(async (id, next) => {
  const rows = await pool.query("SELECT * FROM users WHERE ID = ?", [id]);
  next(null, rows[0]);
});

module.exports = passport;
