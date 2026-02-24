const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize database
const db = new Database('eneba.db');

// Create table and seed data
db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    region TEXT NOT NULL,
    platform TEXT NOT NULL,
    platform_color TEXT NOT NULL,
    original_price REAL,
    current_price REAL NOT NULL,
    discount_percent INTEGER,
    cashback REAL,
    image_url TEXT,
    likes INTEGER DEFAULT 0
  );
`);

// Seed data only if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM games').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO games (title, region, platform, platform_color, original_price, current_price, discount_percent, cashback, image_url, likes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const FIFA_IMG = 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1811260/header.jpg';
  const RDR2_IMG = 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg';
  const SF_IMG = 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2707930/header.jpg';

  const games = [
    // FIFA 23
    ['FIFA 23 EA App Key (PC) GLOBAL', 'GLOBAL', 'EA App', '#ff4444', 59.99, 14.50, 76, 1.45, FIFA_IMG, 1240],
    ['FIFA 23 (Xbox Series X|S) XBOX LIVE Key EUROPE', 'EUROPE', 'Xbox Live', '#107c10', 59.99, 12.90, 79, 1.29, FIFA_IMG, 890],
    ['FIFA 23 (PS4/PS5) PSN Key EUROPE', 'EUROPE', 'PSN', '#003087', 59.99, 15.20, 75, 1.52, FIFA_IMG, 654],
    ['FIFA 23 (Xbox One/Series X|S) XBOX LIVE Key GLOBAL', 'GLOBAL', 'Xbox Live', '#107c10', 59.99, 13.75, 77, 1.38, FIFA_IMG, 421],

    // Red Dead Redemption 2
    ['Red Dead Redemption 2 (PC) Rockstar Key GLOBAL', 'GLOBAL', 'Rockstar', '#b22222', 59.99, 19.90, 67, 1.99, RDR2_IMG, 3200],
    ['Red Dead Redemption 2 (Xbox One/Series X|S) XBOX LIVE Key EUROPE', 'EUROPE', 'Xbox Live', '#107c10', 59.99, 17.50, 71, 1.75, RDR2_IMG, 2100],
    ['Red Dead Redemption 2 (PS4/PS5) PSN Key EUROPE', 'EUROPE', 'PSN', '#003087', 59.99, 21.00, 65, 2.10, RDR2_IMG, 1750],
    ['Red Dead Redemption 2 Ultimate Edition (PC) Rockstar Key GLOBAL', 'GLOBAL', 'Rockstar', '#b22222', 79.99, 24.90, 69, 2.49, RDR2_IMG, 980],

    // Split Fiction
    ['Split Fiction EA App Key (PC) GLOBAL', 'GLOBAL', 'EA App', '#ff4444', 49.99, 40.93, 18, 4.50, SF_IMG, 626],
    ['Split Fiction (Xbox Series X|S) XBOX LIVE Key EUROPE', 'EUROPE', 'Xbox Live', '#107c10', 49.99, 34.14, 32, 3.76, SF_IMG, 500],
    ['Split Fiction (Xbox Series X|S) XBOX LIVE Key GLOBAL', 'GLOBAL', 'Xbox Live', '#107c10', 49.99, 35.15, 30, 3.87, SF_IMG, 1039],
    ['Split Fiction (Nintendo Switch 2) eShop Key EUROPE', 'EUROPE', 'Nintendo', '#e4000f', 49.99, 36.25, null, 3.99, SF_IMG, 288],
  ];

  for (const game of games) {
    insert.run(...game);
  }

  console.log('Database seeded with games.');
}

// GET /list or /list?search=<gamename>
app.get('/list', (req, res) => {
  const search = req.query.search;

  let games;
  if (search) {
    // Fuzzy search: match any part of the title (case-insensitive)
    games = db.prepare(`
      SELECT * FROM games
      WHERE LOWER(title) LIKE LOWER(?)
      ORDER BY likes DESC
    `).all(`%${search}%`);
  } else {
    games = db.prepare('SELECT * FROM games ORDER BY likes DESC').all();
  }

  res.json({
    count: games.length,
    results: games
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/list`);
  console.log(`Try: http://localhost:${PORT}/list?search=fifa`);
});