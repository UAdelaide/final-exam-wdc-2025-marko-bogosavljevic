const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login (changed version)
router.post('/login', async (req, res) => {
  const { user, pass } = req.body; // get username and password instead of email

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [user, pass]); // swapped email and username cause it takes username instead

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log(rows);

    req.session.user = rows[0]; // this was added to add to session
    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    req.session.destroy(function (err) {
      if (err) {
        res.send('Log out failed');
      } else {
        res.send('Logged out successfully!');
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});


router.get('/dogs', async (req, res) => {
  try {
    const [dog_info] = await db.execute('SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username FROM Dogs INNER JOIN Users ON Dogs.owner_id = Users.user_id;');
    res.json(dog_info);
  } catch (err) {
    res.status(500).json({ error: 'failed' });
  }
});

router.get('/getmydogs', async (req, res) => {
  try {
    const [dog_info] = await db.execute('SELECT Dogs.name AS dog_name, Dogs.dog_id, Dogs.size, Users.username AS owner_username FROM Dogs INNER JOIN Users ON Dogs.owner_id = Users.user_id WHERE Dogs.owner_id = ?;',
      [req.session.user.user_id]
    );
    res.json(dog_info);
  } catch (err) {
    res.status(500).json({ error: 'failed' });
  }
});



module.exports = router;
