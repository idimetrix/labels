const md5 = require('md5');
const express = require('express');
const s3Service = require('../services/s3');
const ioService = require('../services/io');
const redisService = require('../services/redis');

const router = express.Router();

router.get('/', async (req, res, next) => {
	const identificator = req.query.id;
	const position = +req.query.position || 1;
	const search = (req.query.search || '').toLowerCase();
	const filter = (req.query.filter || '').toLowerCase();

	const names = await s3Service.files(position < 0);

	let found = false;
	let file = null;

	for (const name of names) {
		const id = md5(name);

		if (!(await redisService.getAsync(id))) {
			await redisService.setAsync(
				id,
				JSON.stringify({
					id,
					name,
					date: name.split('_')[1],
					meta: {
						part: '',
						quantity: '',
						serial: '',
						duplicate: false,
						occluded: false,
						unsure: false,
					},
					boxes: [],
				})
			);
		}

		file = JSON.parse(await redisService.getAsync(id));

		if (identificator === file.id) {
			found = true;
		}

		if (found && !file.meta.part) {
			break;
		}
	}

	if (file) {
		file.locked = !!ioService.allLocks()[file.id];
		file.viewed = !!ioService.allViews()[file.id];
	}

	res.json(file);
});

module.exports = router;
