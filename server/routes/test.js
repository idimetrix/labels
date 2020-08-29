const express = require('express');

const ioService = require('../services/io');

const router = express.Router();

router.get('/', async (req, res, next) => {
	ioService.test();

	res.json({});
});

module.exports = router;
