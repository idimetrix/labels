const fs = require('fs');
const path = require('path');

const redisService = require('./redis');

const AWS = require('aws-sdk');

AWS.config.update({ accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET });

console.log({ accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET });

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// const folder = path.join(__dirname, '../public/data');

const params = {
	Bucket: process.env.AWS_BUCKET,
	Prefix: process.env.AWS_PREFIX,
};

// s3.listBuckets((err, data) => {
//   if (err) {
//     console.log('Error', err);
//   } else {
//     console.log('Success', data);
//   }
// });

class S3 {
	static async files(reverse = false) {
		// const names = fs.readdirSync(folder).map((file) => file);

		let cache = await redisService.getAsync('files');

		console.log('cache', cache);

		const names = cache
			? JSON.parse(cache)
			: await new Promise((resolve) => {
					s3.listObjectsV2(params, async (err, data) => {
						if (err) {
							console.log('Error', err);
						} else {
							const result = data.Contents.map(({ Key }) => Key).sort((a, b) => b.split('_')[1] - a.split('_')[1]);

							await redisService.setAsync('files', JSON.stringify(result), 'EX', 60 * 5); // in seconds

							resolve(result);
						}
					});
			  });

		return reverse ? names.reverse() : names;
	}
}

module.exports = S3;
