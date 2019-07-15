const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.use(express.urlencoded({ extended: true }))

server.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await db('accounts');
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get accounts' });
  }
});

server.get('/api/accounts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const account = await db('accounts').where({ id });
    if (account.length) {
      res.json(account);
    } else {
      res.status(404).json({ message: 'Could not find account with given id.' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to get account' });
  }
});

server.post('/api/accounts', async (req, res) => {
  const { name, budget } = req.body;

  if (!name || !budget) {
    res.status(400).json({ errorMessage: 'name and budget field is required' });
  }
  else {
    try {
      const [newAccountId] = await db('accounts').insert({ name, budget });
      if (newAccountId) {
        const newAccount = await db('accounts').where({ id: newAccountId });
        res.json(newAccount);
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Failed to create account' });
    }
  }
})

server.delete('/api/accounts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const account = await db('accounts').where({ id }).del();
    if (account) {
      res.json({message: 'Deleted Successfully'});
    } else {
      res.status(404).json({ message: 'Could not find account with given id.' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

server.put('/api/accounts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, budget } = req.body;

  if (!name || !budget) {
    res.status(400).json({ errorMessage: 'name and budget field is required' });
  }
  else {
    try {
      console.log(id, name, budget);
      const updateResponse = await db('accounts').where({ id }).update({
        name, budget
      });
      console.log(updateResponse);
      if (updateResponse) {
        const updatedAccount = await db('accounts').where({ id });
        res.json(updatedAccount);
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Failed to update account' });
    }
  }
})

module.exports = server;