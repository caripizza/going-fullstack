const client = require('../db-client');
const synths = require('./synths.json');

console.log(synths);

Promise.all(
  synths.map(synth => {
    return client.query(`
      INSERT INTO synths (name, image, polyphonic, year)
      VALUES ($1, $2, $3, $4);
    `,
    [synth.name, synth.image, synth.polyphonic, synth.year]);
  })
)
  .then(
    () => console.log('seed data load complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });