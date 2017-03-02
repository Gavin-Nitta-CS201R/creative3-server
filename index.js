const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
const uuid = require('node-uuid');
var db = require('./db.js');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  let obj = {
    uri: req.body.uri,
    id: uuid.v4()
  };

  res.send(`Here we are! ${JSON.stringify(obj)}`);
});

app.get('/image', (req, res) => {
  db.query(`SELECT * FROM images`)
    .then(resp => {
      res.send(resp.rows);
    }).catch(err => {
      res.send(err);
    });
});

app.post('/image', (req, res) => {
  db.query(`INSERT INTO images(id, name, creator, uri, votes) VALUES($1, $2, $3, $4, $5)`, [uuid.v4(), req.body.name, req.body.creator, req.body.uri, 0])
    .then(_ => {
      res.send('Successfully inserted image');
    }).catch(err => {
      res.send(err);
    });
});

app.post('/vote/:id', (req, res) => {
  db.query(`SELECT * FROM images WHERE id = $1`, [req.params.id])
    .then(image => {
      let votes = image.rows[0].votes + 1;
      db.query(`UPDATE images SET votes = $1 WHERE id = $2`, [votes, req.params.id])
        .then(_ => {
          res.send('Successfully updated vote');
        }).catch(err => {
          res.send(err);
        });
    }).catch(err => {
      res.send(err);
    });
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
