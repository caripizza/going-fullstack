const express = require('express');
const app = express();
const morgan = require('morgan');
const pg = require('pg');


app.use(morgan('dev'));

// utility that check requests, if body turn into JSON and ready it for us
app.use(express.json());

const Client = pg.Client;
const databaseUrl = 'postgres://localhost:5432/synthesizers';
const client = new Client(databaseUrl);
client.connect();

app.get('/api/synths', (req, res) => {
  // TODO: reimplement queries
  // if(req.query.name) {
  client.query(`
      SELECT name, image, polyphonic, year, id FROM synths;
    `)
    .then(result => {
      res.json(result.rows);
    });
});


app.post('/api/synths', (req, res) => {
  const body = req.body;
  client.query(`
    INSERT INTO synths (name, image, polyphonic, year, id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING name, image, polyphonic, year, id;
  `,
  [body.name, body.image, body.polyphonic, body.year])
    .then(result => {
      res.json(result.rows[0]);
    });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log('server app started on port', PORT);
});