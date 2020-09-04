const path = require('path');
const md5 = require('md5');

function chunks(arr, len) {
	const chunks = [];
	let i = 0;
	let n = arr.length;

	while (i < n) {
		chunks.push(arr.slice(i, (i += len)));
	}

	return chunks;
}

function unique(arr) {
	return arr.filter((item, index, arr) => arr.indexOf(item) === index);
}

function s3ToDb(files) {
	const images = [];

	for (const file of files) {
		const hash = md5(file.Key);
		const name = path.basename(file.Key);
		const dirname = path.dirname(file.Key) || 'default';
		const id = ['', '.', '..'].includes(dirname) ? 'default' : dirname;
		const date = +name.split('_')[1];

		images.push({
			id,
			name,
			hash,
			path: file.Key,
			size: file.Size,
			sort: `${date}_${file.Size}`,
			modified: `${file.LastModified}`,
			date,
			meta: {
				part: '',
				quantity: '',
				serial: '',
				duplicate: false,
				occluded: false,
				unsure: false,
			},
			boxes: [],
		});
	}

	return images;
}

module.exports = { s3ToDb, chunks, unique };
