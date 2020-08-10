const router = require("express").Router();
const passport = require("passport");
const { isLoggedIn } = require("../lib/protectedRoutesAuth");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/signin", (req, res) => {
  res.render("auth/signin");
});

/* router.post("/signup", (req, res) => {
  passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  });
  res.send("recibido");
}); */

router.post("/signin", (req, res, next) => {
  passport.authenticate("local.signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/signin");
});

module.exports = router;
