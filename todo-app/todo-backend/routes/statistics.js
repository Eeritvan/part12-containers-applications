const express = require('express');
const router = express.Router();
const { getAsync } = require('../redis')

router.get('/', async (_, res) => {
  const added_todos = await getAsync("count")
  res.send({ added_todos });
});

module.exports = router;