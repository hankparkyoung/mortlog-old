import express from 'express';
import dotenv from 'dotenv';
import { createConnection } from 'mysql';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const connection = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Connected to the database');
  }
});

app.get('/units', (req, res) => {
  connection.query('SELECT * FROM units', (error, data) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving units');
    } else {
      res.send(data);
    }
  });
});

// not sure if we ever require to fetch a single unit by ID
// app.get('/units/:unitId', (req, res) => {
//   const { unitId } = req.params;
//   connection.query(`SELECT * FROM units WHERE id = ${unitId}`, (error, data) =>  {
//     if (error) {
//       console.error(error);
//       res.status(500).send('Error retrieving unit');
//     } else {
//       res.send(data);
//     }
//   });
// });

app.post('/units', (req, res) => {
  const { name, cost } = req.body;
  connection.query('INSERT INTO units (name, cost) VALUES (?, ?)', [name, cost], (error) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error creating unit');
    } else {
      res.send(`Unit ${name} of cost ${cost} was created successfully`)
    }
  });
});

app.put('/units/:unitId', (req, res) => {
  const { unitId } = req.params;
  const { name, cost } = req.body;
  const sql = 'UPDATE units SET name = ?, cost = ? WHERE id = ?';
  connection.query(sql, [name, cost, unitId], (error) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error updating unit');
      } else {
        res.send('Unit was updated successfully');
      }
    });
});
