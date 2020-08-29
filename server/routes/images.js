const md5 = require('md5');
const express = require('express');
const s3Service = require('../services/s3');
const ioService = require('../services/io');
const redisService = require('../services/redis');

const router = express.Router();

router.get('/', async (req, res, next) => {
	const offset = +req.query.offset || 0;
	const limit = +req.query.limit || 10;
	const search = (req.query.search || '').toLowerCase();
	const filter = (req.query.filter || '').toLowerCase();

	const names = await s3Service.files();

	const files = [];

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

		files.push(JSON.parse(await redisService.getAsync(id)));
	}

	let filtered = [];

	if (search) {
		filtered = files.filter(({ meta }) => {
			return (
				meta.part.toLowerCase().indexOf(search) !== -1 || meta.quantity.toLowerCase().indexOf(search) !== -1 || meta.serial.toLowerCase().indexOf(search) !== -1
			);
		});
	} else {
		filtered = files.slice();
	}

	for (const file of filtered) {
		file.locked = !!ioService.allLocks()[file.id];
		file.viewed = !!ioService.allViews()[file.id];
	}

	const images = {
		offset,
		limit,
		files: filtered.slice(offset, offset + limit),
		total: filtered.length,
	};

	res.json(images);
});

module.exports = router;
