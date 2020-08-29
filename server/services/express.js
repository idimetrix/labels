require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

const server = require('http').createServer(app);

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

server.listen(process.env.PORT || 3000);
server.on('error', () => {
	//
});
server.on('listening', () => {
	//
});

module.exports = {
	app,
	server,
};
