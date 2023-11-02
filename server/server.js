import express from 'express';
import { createConnection } from 'mysql';
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const connection = createConnection({
  host: 'localhost',
  user: 'hankpark',
  password: 'hankpark',
  database: 'mortlog'
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
