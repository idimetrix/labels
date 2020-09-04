const AWS = require('aws-sdk');

AWS.config.update({ accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET, region: process.env.AWS_REGION });

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

class S3 {
	static async files({ parameters = {}, callback = null } = {}) {
		let files = [];
		let loop = true;
		let index = 0;

		let ContinuationToken = null;

		while (loop) {
			try {
				const data = await s3.listObjectsV2({ ...(parameters || {}), Bucket: process.env.AWS_BUCKET, ContinuationToken, MaxKeys: 1000 }).promise();

				if (!data.IsTruncated) {
					loop = false;
					ContinuationToken = null;
				} else {
					ContinuationToken = data.NextContinuationToken;
				}

				callback && callback(data.Contents || [], index);

				files.push(...(data.Contents || []));

				index++;
			} catch {
				loop = false;
			}
		}

		return files;
	}
}

module.exports = S3;
