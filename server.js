// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db');

const app = express();
const port = process.env.PORT || 3001;

const cors = require('cors');
app.use(cors());


app.use(bodyParser.json());

app.post('/submit', (req, res) => {
    const { content, openingDate } = req.body;
  
    db.run('INSERT INTO messages (content, openingDate) VALUES (?, ?)', [content, openingDate], function (err) {
      if (err) {
        console.error('Error inserting message:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      const messageId = this.lastID;
      res.status(200).json({ messageId });
    });
  });
  
  
app.get('/message/:id', (req, res) => {
    const messageId = req.params.id;

    db.get('SELECT content, openingDate FROM messages WHERE id = ?', [messageId], (err, row) => {
        if (err) {
        console.error('Error fetching message:', err);
        res.status(500).send('Error fetching message');
        } else if (!row) {
        res.status(404).send('Message not found');
        } else {
        const { content, openingDate } = row;
        const currentDate = new Date().toISOString();
        const isDatePassed = currentDate > openingDate;

        if (isDatePassed) {
            res.status(200).json({ content });
        } else {
            res.status(200).json({ openingDate: openingDate});
        }
        }
    });
});
  
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
