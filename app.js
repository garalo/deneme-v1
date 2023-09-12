const express = require("express");
//const mongodb = require('mongodb'); Eski veya hatalı
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const port = 3000;

const expressLayouts = require("express-ejs-layouts");

const articles = [
  { title: "Title 1", body: "Body 1" },
  { title: "Title 2", body: "Body 2" },
  { title: "Title 3", body: "Body 3" },
  { title: "Title 4", body: "Body 4" },
];

//const db = mongodb.MongoClient('mongodb://localhost:27017/mydb');
///MongoDB bağlantısı
mongoose.connect('mongodb://127.0.0.1:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB bağlantı hatası:'));
db.once('open', () => {
  console.log('MongoDB bağlantısı başarılı.');
});

// Kullanıcı modeli ve koleksiyonunu tanımla
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.set("view engine", "ejs");
app.use(expressLayouts); // express-ejs-layouts'i kullanacağımızı belirtiyoruz
app.use(express.urlencoded({ extended: true }));

// express-session ayarları
app.use(session({
  secret: 'secret-key', // Değiştirmeniz gereken bir anahtar
  resave: false,
  saveUninitialized: true
}));

// Ana sayfa
app.get("/", (req, res) => {
  if (req.session.user) {
    // Oturum açmış bir kullanıcı varsa, kullanıcı bilgilerine erişebilirsiniz
    const user = req.session.user.username;
    //res.send(`Hoş geldiniz, ${user}!`);
    console.log(`Hoş geldiniz, ${user}!`);
    res.render("index", { title: "Ana Sayfa",  user: user });
  } else {
    // Oturum açmış bir kullanıcı yoksa, giriş yapmalarını isteyebilirsiniz
    //res.redirect('/login');
    res.render("index", { title: "Ana Sayfa" });
  }
});

app.get("/login", (req, res) => {
  //res.render('login');
  res.render("login", { title: "Giriş Sayfası" });
});

app.post('/login', async (req, res) => {
  //const { username, password } = req.body;

  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findOne({ username: username }).exec();

    if (!user) {
      return res.send('Hata: Kullanıcı bulunamadı.');
      //const user = new User({
      //  username: 'admin',
      // password: 'admin',
      // });

      // user.save()
    }

    const isValidPassword = user.password === password;

    if (isValidPassword) {
      // Kullanıcı girişi başarılı olduğunda
      //const username = req.body.username; // Kullanıcı adını alın veya gerektiği gibi veritabanından çekin (Yukarıda var buna gerek yok)
      // Kullanıcı oturumu açma işlemi
      req.session.user = {
        username: username,
        // Diğer kullanıcı bilgilerini buraya ekleyebilirsiniz
      };

      return res.redirect('/');
    } else {
      return res.send('Hata: Yanlış şifre.');
    }
  } catch (error) {
    return res.send('Hata: Veritabanına erişilemedi.');
  }
});

// Hakkımızda sayfası
app.get("/about", (req, res) => {
  res.render("about", { title: "Hakkımızda" });
});

app.get("/articles", (req, res) => {
  res.render("articles", {
    articles,
    title: "Blog",
  });
});

// Contact sayfası
app.get("/contact", (req, res) => {
  res.render("contact", { title: "İletişim" });
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});
