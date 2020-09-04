const _ = require('lodash');
const path = require('path');
const md5 = require('md5');

const s3Service = require('./s3');
const { Files } = require('./db');
const redisService = require('./redis');

const { s3ToDb } = require('../utils');

class Sync {
	static async sync(reset = false) {
		if (reset) {
			await redisService.delAsync('caches');
			await redisService.delAsync('events');
		}

		await s3Service.files({
			callback: async (files, index) => {
				const caches = JSON.parse(await redisService.getAsync('caches')) || [];
				const events = JSON.parse(await redisService.getAsync('events')) || {};

				const filters = files.filter((file) => !_.find(caches, { Key: file.Key }) && file.Size);

				const groups = _.chunk(filters, 25);

				console.log(`Iteration #${index + 1} chunks ${groups.length}, filters ${filters.length}, images ${files.length} syncing...`);

				for (const group of groups) {
					const i = `${index + 1}.${groups.indexOf(group)}`;
					const s = `${group.length}/${filters.length}/${files.length}`;

					console.log(`Iteration #${i} - ${s} syncing...`);

					const records = s3ToDb(group);

					for (const record of records) {
						events[record.id] = events[record.id] || {
							id: md5(record.id),
							name: record.id,
							size: 0,
						};

						events[record.id].size++;
					}

					try {
						const result = await Files.batchPut(records);

						console.log({ result });
					} catch (error) {
						console.error({ error });
					}

					console.log(`Iteration #${i} - ${s} synced!`);
				}

				await redisService.setAsync('caches', JSON.stringify(_.uniqBy(caches.concat(files).filter(Boolean), 'Key')));
				await redisService.setAsync('events', JSON.stringify(events));

				console.log(`Iteration #${index + 1} chunks ${groups.length}, filters ${filters.length}, images ${files.length} synced!`);
			},
		});
	}
}

module.exports = Sync;
