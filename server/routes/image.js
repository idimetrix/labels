const express = require('express');
const md5 = require('md5');
const dynamoose = require('dynamoose');

const ioService = require('../services/io');
const { Files } = require('../services/db');

const router = express.Router();

router.get('/', async (req, res, next) => {
	const { id, hash } = JSON.parse(req.query.file || '{}');
	const position = +req.query.position || 1;

	const condition = new dynamoose.Condition().where('id').eq(id);

	const data = await Files.query(condition).sort('descending').exec();

	const files = [...data];

  const allLocks = ioService.allLocks();
  const allViews = ioService.allViews();

	let found = false;

	let leftFile = null;
	let rightFile = null;

	for (let file of files) {
		if (!file.meta.part) {
			if (file.hash === hash) {
				found = true;

				if (leftFile && position < 0) break;
			} else {
			  if(!allLocks[file.hash] && !allViews[file.hash]) {
          if (!found) {
            leftFile = file;
          } else {
            rightFile = file;
            break;
          }
        }
			}
		}
	}

	const file = position < 0 ? leftFile || rightFile : rightFile || leftFile;

	if (file) {
		file.locked = !!allLocks[file.hash];
		file.viewed = !!allViews[file.hash];
		file.index = files.indexOf(file);
		file.count = files.length;
	}

	res.json(file || req.query.file);
});

module.exports = router;
