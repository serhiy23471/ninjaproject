const express = require("express");
const session = require("express-session");
const steam = require("steam-login");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 ВСТАВ СВІЙ Steam API Key
const STEAM_API_KEY = "ТУТ_ТВІЙ_STEAM_API_KEY";

// Налаштування сесій
app.use(session({
  secret: "super_secret_key", // заміни на свій реальний секрет
  resave: false,
  saveUninitialized: true
}));

// Steam OpenID middleware — ВАЖЛИВО: realm і verify вказані через твій домен!
app.use(steam.middleware({
  realm: "https://ninjaproject.com.ua/",
  verify: "https://ninjaproject.com.ua/verify",
  apiKey: STEAM_API_KEY
}));

// Якщо маєш HTML-файли — наприклад, index.html
app.use(express.static(path.join(__dirname, "public")));

// Сторінка з кнопкою Steam-логіна
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Steam Login</title></head>
      <body>
        <div class="top-social">
          <a href="/authenticate">Увійти через Steam</a>
        </div>
      </body>
    </html>
  `);
});

// Авторизація через Steam
app.get("/authenticate", steam.authenticate(), (req, res) => {});

// Після підтвердження в Steam → повертає дані
app.get("/verify", steam.verify(), (req, res) => {
  const user = req.user;
  req.session.user = user;

  res.send(`
    <h2>Вітаємо, ${user.personaname}</h2>
    <img src="${user.avatarfull}" alt="avatar" />
    <p>SteamID: ${user.steamid}</p>
    <a href="/logout">Вийти</a>
  `);
});

// Вихід
app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на порту ${PORT}`);
});


// Копіювання IP

