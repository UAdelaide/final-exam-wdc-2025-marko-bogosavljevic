var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

let db;

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

app.get('/api/dogs', async (req, res) => {
  try {
    const [dog_info] = await db.execute('SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username FROM Dogs INNER JOIN Users ON Dogs.owner_id = Users.user_id;');
    res.json(dog_info);
  } catch (err) {
    res.status(500).json({ error: 'failed' });
  }
});

app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [walkrequests] = await db.execute('SELECT WalkRequests.request_id, Dogs.name AS dog_name, WalkRequests.requested_time, WalkRequests.duration_minutes, WalkRequests.location, Users.username AS owner_username FROM WalkRequests INNER JOIN Dogs ON Dogs.dog_id = WalkRequests.dog_id INNER JOIN Users ON Users.user_id = Dogs.owner_id WHERE WalkRequests.status = "open";');
    res.json(walkrequests);
  } catch (err) {
    res.status(500).json({ error: 'failed' });
  }
});

app.get('/api/walkers/summary', async (req, res) => {
  try {
    const [walkers] = await db.execute('SELECT Users.username, Count(WalkRatings.rating) AS total_ratings, ACVG(WalkRatings.rating) AS average_rating, COUNT(WalkRatings.rating_id) AS ;');
    res.json(walkers);
  } catch (err) {
    res.status(500).json({ error: 'failed' });
  }
});


module.exports = app;
