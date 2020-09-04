const _ = require('lodash');

const express = require('express');
const md5 = require('md5');
const redisService = require('../services/redis');

const router = express.Router();

router.get('/', async (req, res, next) => {
	const offset = +req.query.offset || 0;
	const limit = +req.query.limit || 100;
	const order = ['ascending', 'descending'].includes(req.query.order) ? req.query.order : 'descending';
	const search = (req.query.search || '').toLowerCase();

	const data = JSON.parse(await redisService.getAsync('events')) || {};

	const keys = Object.keys(data).filter((key) => !search || key.toLowerCase().indexOf(search) !== -1);

	let objects = keys.map((key) => data[key]);

	switch (order) {
		case 'ascending':
			objects = _.orderBy(objects, ['size'], ['asc', 'name']);
			break;
		case 'descending':
			objects = _.orderBy(objects, ['size'], ['desc', 'name']);
			break;
	}

	const events = objects.slice(offset, offset + limit);

	res.json({
		offset,
		limit,
		events,
		total: keys.length,
	});
});

module.exports = router;
