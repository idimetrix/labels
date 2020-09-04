const express = require('express');
const md5 = require('md5');
const dynamoose = require('dynamoose');

const ioService = require('../services/io');
const { Files } = require('../services/db');

const router = express.Router();

router.get('/', async (req, res, next) => {
	const event = req.query.event || 'default';
	const offset = +req.query.offset || 0;
	const limit = +req.query.limit || 10;
	const order = ['ascending', 'descending'].includes(req.query.order) ? req.query.order : 'descending';
	const search = req.query.search || '';
	const filters = req.query.filters ? JSON.parse(req.query.filters) : {};

	let condition = new dynamoose.Condition().where('id').eq(event);

	if (search) {
		condition = condition
			.and()
			.parenthesis(
				new dynamoose.Condition()
					.where('name')
					.contains(search)
					.or()
					.where('meta.part')
					.contains(search)
					.or()
					.where('meta.quantity')
					.contains(search)
					.or()
					.where('meta.serial')
					.contains(search)
			);
	}

	if (filters && Object.keys(filters).length) {
		Object.keys(filters).forEach((key) => {
			if (filters[key]) {
				const fn = filters[key].fn || 'eq';
				const value = filters[key].value || filters[key];

				switch (value) {
					case 'yes':
						condition = condition.and().where(key).not()[fn].apply(condition, [].concat(''));
						break;
					case 'no':
						condition = condition.and().where(key)[fn].apply(condition, [].concat(''));
						break;
					case 'true':
						condition = condition.and().where(key).not()[fn].apply(condition, [].concat(true));
						break;
					case 'false':
						condition = condition.and().where(key)[fn].apply(condition, [].concat(false));
						break;

					default:
						condition = condition.and().where(key)[fn].apply(condition, [].concat(value));
						break;
				}
			}
		});
	}

	// const key = md5(JSON.stringify(parameters));

	// const cache = JSON.parse(await redisService.getAsync(key));

	const data = /*cache ||*/ await Files.query(condition).sort(order).exec();

	// if (!cache) {
	// 	await redisService.setAsync(key, JSON.stringify(results), 'EX', 60 * 5); // seconds
	// }

	const list = [...data];

	const files = list.slice(offset, offset + limit);

	const allLocks = ioService.allLocks();
	const allViews = ioService.allViews();

	let it = 0;

	for (const file of files) {
		file.locked = !!allLocks[file.hash];
		file.viewed = !!allViews[file.hash];
		file.index = offset + it++;
		file.count = list.length;
	}

	res.json({
		offset,
		limit,
		files,
		total: list.length,
	});
});

module.exports = router;
