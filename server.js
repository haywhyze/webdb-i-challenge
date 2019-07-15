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

module.exports = server;