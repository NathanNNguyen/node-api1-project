// implement your API here

const express = require('express'); // import express

const Users = require('./data/db.js');

const server = express(); // create server 

server.use(express.json()); // middleware teaches express to do things

// dashboard
server.get(`/`, (req, res) => {
  res.json({ Hello: `It's working` })
});

// get the list of users
server.get('/api/users', (req, res) => {
  Users.find().then(users => {
    res.status(200).json(users)
  }).catch(err => {
    console.log(err);
    res.status(500).json({ errorMessage: 'The users information could not be retrieved.' })
  })
});

// add new user
server.post('/api/users', (req, res) => {
  const user = req.body;
  if (user.name && user.bio) {
    Users.insert(user).then(user => {
      res.status(201).json(user)
    }).catch(err => {
      console.log(err);
      res.status(500).json({ errMessage: 'There was an error while saving the user to the database.' })
    })
  } else {
    res.status(400).json({ error: 'Please provide name and bio for the user.' })
  }
})

// delete a user
server.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({ error: 'The user with the specified ID does not exist.' })
    } else {
      const removed = await Users.remove(id);
      res.status(200).json(removed);
    }
  }
  catch{
    res.status(500).json({ error: 'The user could not be removed.' })
  }
  // if (specUser.id !== id) {
  //   res.status(404).json({ error: 'The user with the specified ID does not exist.' })
  // }
  // else {
  //   Users.remove(id).then(removed => {
  //     res.status(200).json(removed);
  //   }).catch(err => {
  //     console.log(err);
  //     res.status(500).json({ error: 'The user could not be removed.' })
  //   })
  // }
});

// update a user
server.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const specUser = req.body;

  try {
    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({ error: 'The user with the specified ID does not exist.' })
    } else if (!specUser.name || !specUser.bio) {
      res.status(400).json({ message: 'Please provide name and bio for the user.' })
    } else {
      const updated = await Users.update(id, specUser);
      res.status(200).json(updated);
    }
  }
  catch {
    res.status(500).json({ message: 'The user information could not be modified.' })
  }

  // if (specUser.id !== id) {
  //   res.status(404).json({ err: 'The user with the specified ID does not exist.' })
  // } else if (!specUser.name || !specUser.bio) {
  //   res.status(400).json({ message: 'Please provide name and bio for the user.' })
  // } else {
  //   Users.update(id, specUser).then(user => {
  //     res.status(200).json(user)
  //   }).catch(err => {
  //     console.log(err);
  //     res.status(500).json({ errorMessage: "The user information could not be modified." });
  //   })
  // }
})

// create port and make server listen to it
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n Server listening on port ${port} \n`));