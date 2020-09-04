const dynamoose = require('dynamoose');

const { server } = require('./express');

const { Files } = require('../services/db');

const io = require('socket.io')(server, {});

class IO {
	static instances = [];

	socket = null;
	views = {};
	locks = {};

	// --- getters / setters

	get query() {
		return this.socket.handshake.query;
	}

	get id() {
		return this.query.hash;
	}

	// --- constructor / destructor

	constructor(socket) {
		this.socket = socket;

		this.debug(`socket with id ${this.hash} constructed`, this.query);

		this.socket.on('disconnect', this.destructor.bind(this));
		this.socket.on('lock', this.lock.bind(this));
		this.socket.on('view', this.view.bind(this));
		this.socket.on('update', this.update.bind(this));

		IO.instances.push(this);
	}

	destructor() {
		this.debug(`socket with id ${this.hash} destructed`, this.query);

		Object.keys(this.views).forEach((key) => this.view({ file: this.views[key], bool: false }));
		Object.keys(this.locks).forEach((key) => this.lock({ file: this.locks[key], bool: false }));

		this.socket = null;

		const index = IO.instances.indexOf(this);

		if (index !== -1) {
			IO.instances.splice(index, 1);
		}
	}

	// --- static

	static allViews() {
		const result = {};

		IO.instances.forEach(({ views }) => {
			Object.keys(views).forEach((key) => (result[key] = views[key]));
		});

		return result;
	}

	static allLocks() {
		const result = {};

		IO.instances.forEach(({ locks }) => {
			Object.keys(locks).forEach((key) => (result[key] = locks[key]));
		});

		return result;
	}

	// --- methods

	debug(...args) {
		console.log.apply(console, args);
	}

	async update(data) {
		this.debug('client said update', data);

		const fields = ['meta', 'boxes'];

		const update = fields.reduce((obj, field) => ({ ...obj, [field]: data[field] }), {});

		try {
			Files.update({ id: data.id, sort: data.sort }, update, { condition: new dynamoose.Condition().where('hash').eq(data.hash) });
		} catch (error) {
			console.error({ error });
		}

		io.emit('updated', data);
	}

	async view(data) {
		this.debug('client said view', data);

		if (data.bool) {
			this.views[data.file.hash] = data.file;
		} else {
			delete this.views[data.file.hash];
		}

		this.socket.broadcast.emit('viewed', data);
	}

	async lock(data) {
		this.debug('client said lock', data);

		if (data.bool) {
			this.locks[data.file.hash] = data.file;
		} else {
			delete this.locks[data.file.hash];
		}

		this.socket.broadcast.emit('locked', data);
	}
}

io.on('connection', (socket) => new IO(socket));

module.exports = IO;
