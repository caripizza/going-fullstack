// const express = require('express');
const client = require('../../db-client');
const Router = require('express').Router;
const router = Router(); // eslint-disable-line new-cap

router
  .get('/', (req, res) => {
    client.query(`
      SELECT 
        synths.id, 
        synths.name as name,
        synths.image as image,
        synths.polyphonic as polyphonic,
        synths.year as year,
        manufacturer.id as "manufacturerId",
        manufacturer.name as manufacturer
      FROM synths
      JOIN manufacturer
      ON synths.manufacturer_id = manufacturer.id
      ORDER BY id ASC;
    `)
      .then(result => {
        res.json(result.rows);
      });
  })

  .get('/:id', (req, res) => {
    client.query(`
    SELECT * FROM synths WHERE id = $1;
  `,
    [req.params.id])
      .then(result => {
        res.json(result.rows[0]);
      });
  })

  .delete('/:id', (req, res) => {
    client.query(`
    DELETE FROM synths WHERE id = $1;
  `,
    [req.params.id])
      .then(result => {
        res.json({ removed: result.rowCount === 1 });
      });
  })

  .post('/', (req, res) => {
    const body = req.body;
    client.query(`
    INSERT INTO synths (name, manufacturer_id, image, polyphonic, year)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `,
    [body.name, body.manufacturerId, body.image, body.polyphonic, body.year])
      .then(result => {
        const id = result.rows[0].id;

        return client.query(`
      SELECT 
        synths.id, 
        synths.name as name,
        synths.image as image,
        synths.polyphonic as polyphonic,
        synths.year as year,
        manufacturer.id as "manufacturerId"
      FROM synths
      JOIN manufacturer
      ON synths.manufacturer_id = manufacturer.id
      WHERE synths.id = $1;
  `,
        [id]);
      })
      .then(result => {
        res.json(result.rows[0]);
      });
  });

module.exports = router;