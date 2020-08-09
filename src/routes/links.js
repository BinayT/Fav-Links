const router = require("express").Router();
const pool = require("../database");

//ALL THE LISTS
router.get("/", async (req, res) => {
  const links = await pool.query("SELECT * FROM links");
  console.log(links);
  res.render("links/list", { links });
});

//RENDERING ADD LISTS
router.get("/add", (req, res) => {
  res.render("links/add");
});

//ADD LISTS
router.post("/add", async (req, res) => {
  const { title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description,
  };
  await pool.query("INSERT INTO links set ?", [newLink]);
  req.flash("success", "Linked Added Successfully");
  res.redirect("/links/add");
});

///DELETE LISTS
router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM links WHERE ID = ?", [id]);
  res.redirect("/links");
});

//EDIT LISTS
router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const links = await pool.query("SELECT * FROM links WHERE ID = ?", [id]);
  console.log(links);
  res.render("links/edit", { link: links[0] });
});

router.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const newLink = {
    title,
    description,
    url,
  };
  await pool.query("UPDATE links set ? WHERE id= ?", [newLink, id]);
  res.redirect("/links");
});

module.exports = router;
