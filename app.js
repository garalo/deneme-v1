const express = require("express");
const app = express();
const port = 3000;

const expressLayouts = require("express-ejs-layouts");

const articles = [
  { title: "Title 1", body: "Body 1" },
  { title: "Title 2", body: "Body 2" },
  { title: "Title 3", body: "Body 3" },
  { title: "Title 4", body: "Body 4" },
];

app.set("view engine", "ejs");
app.use(expressLayouts); // express-ejs-layouts'i kullanacağımızı belirtiyoruz

// Ana sayfa
app.get("/", (req, res) => {
  res.render("index", { title: "Ana Sayfa" });
});

// Hakkımızda sayfası
app.get("/about", (req, res) => {
  res.render("about", { title: "Hakkımızda" });
});

app.get("/articles", (req, res) => {
  res.render("articles", {
    articles,
    title: "blog",
  });
});

// Contact sayfası
app.get("/contact", (req, res) => {
  res.render("contact", { title: "İletişim" });
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});
