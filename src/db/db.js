// db/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'messages.db');
const db = new sqlite3.Database(dbPath);

// db/db.js

const initDb = () => {
  // Drop the existing 'messages' table
  db.run('DROP TABLE IF EXISTS messages', (dropErr) => {
    if (dropErr) {
      console.error('Error dropping table:', dropErr);
    } else {
      console.log('Table dropped');
    }

    // Create the 'messages' table with the updated schema
    const schema = require('fs').readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
    db.exec(schema, (createErr) => {
      if (createErr) {
        console.error('Error creating table:', createErr);
      } else {
        console.log('Table created');
      }
    });
  });
};

initDb();


module.exports = db;