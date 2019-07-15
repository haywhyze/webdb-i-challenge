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

module.exports = server;