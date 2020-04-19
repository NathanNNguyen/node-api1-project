const express = require('express');

const server = express();

const db = require('./data/db.js');
server.use(express.json());

server.get('/', async (req, res) => {
  res.send('Server working')
});



const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n Listerning on port ${port}... \n`))