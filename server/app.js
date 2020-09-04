const cron = require('node-cron');

const { app } = require('./services/express');

require('./services/io');
require('./services/redis');

// app.use('/', require('./routes/index'));
app.use('/images', require('./routes/images'));
app.use('/image', require('./routes/image'));
app.use('/events', require('./routes/events'));
app.use('/views', require('./routes/views'));
app.use('/locks', require('./routes/locks'));
app.use('/test', require('./routes/test'));

if (+process.env.SYNC) {
	const { sync } = require('./services/sync');

	cron.schedule(process.env.SYNC_SCHEDULE, sync);

	if (+process.env.SYNC_IMMEDIATE) {
		sync(+process.env.SYNC_RESET);
	}
}
