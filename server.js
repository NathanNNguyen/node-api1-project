const express = require('express');

const server = express();

const db = require('./data/db.js');
server.use(express.json());

server.get('/', (req, res) => {
  res.send('Server working')
});

server.post('/api/users', async (req, res) => {
  const user = req.body;
  try {
    const inserted = await db.insert(user);
    if (user.name && user.bio) {
      res.status(201).json(user)
    } else {
      res.status(400).json({ message: 'Please provide name and bio for the user' })
    }
  }
  catch (err) {
    res.status(500).json({ err, message: 'There was an error while saving the user to the database' })
  }
});

server.get('/api/users', async (req, res) => {
  try {
    const users = await db.find();
    res.status(200).json(users);
  }
  catch (err) {
    res.status(500).json({ err, message: 'The users information could not be retrieved' })
  }
});

server.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.findById(id);
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'The user with the specified ID does not exist' })
    }
  }
  catch (err) {
    res.status(500).json({ err, message: 'The user information could not be retrieved' })
  }
})


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n Listerning on port ${port}... \n`))