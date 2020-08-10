const router = require("express").Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/protectedRoutesAuth");

//ALL THE LISTS
router.get("/", isLoggedIn, async (req, res) => {
  const links = await pool.query("SELECT * FROM links WHERE user_id = ?", [
    req.user.id,
  ]);
  console.log(links);
  res.render("links/list", { links });
});

//RENDERING ADD LISTS
router.get("/add", isLoggedIn, (req, res) => {
  res.render("links/add");
});

//ADD LISTS
router.post("/add", isLoggedIn, async (req, res) => {
  const { title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id,
  };
  await pool.query("INSERT INTO links set ?", [newLink]);
  req.flash("success", "Links Added Successfully");
  res.redirect("/links/add");
});

///DELETE LISTS
router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM links WHERE ID = ?", [id]);
  req.flash("success", "Links Removed Successfully");
  res.redirect("/links");
});

//EDIT LISTS
router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const links = await pool.query("SELECT * FROM links WHERE ID = ?", [id]);
  console.log(links);
  res.render("links/edit", { link: links[0] });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const newLink = {
    title,
    description,
    url,
  };
  await pool.query("UPDATE links set ? WHERE id= ?", [newLink, id]);
  req.flash("success", "Links Updated Successfully");
  res.redirect("/links");
});

module.exports = router;
