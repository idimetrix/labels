const express = require('express');

const ioService = require('../services/io');

const router = express.Router();

router.get('/', async (req, res, next) => {
	res.json(ioService.allLocks());
});

module.exports = router;
