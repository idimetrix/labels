const dynamoose = require('dynamoose');

dynamoose.aws.sdk.config.update({ accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET, region: process.env.AWS_REGION });

const Files = dynamoose.model('files', {
	id: String,
	name: String,
	hash: String,
	path: String,
	size: Number,
	sort: String,
	modified: String,
	date: Number,
	meta: new dynamoose.Schema({
		part: String,
		quantity: String,
		serial: String,
		duplicate: Boolean,
		occluded: Boolean,
		unsure: Boolean,
	}),
	boxes: Array,
});

module.exports = {
	Files,
};
