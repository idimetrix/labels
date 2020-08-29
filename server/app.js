const { app } = require('./services/express');

require('./services/io');
require('./services/redis');

app.use('/', require('./routes/index'));
app.use('/image', require('./routes/image'));
app.use('/images', require('./routes/images'));
app.use('/attachments', require('./routes/attachments'));
app.use('/locks', require('./routes/locks'));
app.use('/test', require('./routes/test'));
