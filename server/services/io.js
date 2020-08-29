const { server } = require('./express');

const redisService = require('./redis');

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
		return this.query.id;
	}

	// --- constructor / destructor

	constructor(socket) {
		this.socket = socket;

		console.log(`socket with id ${this.id} constructed`, this.query);

		this.socket.on('disconnect', this.destructor.bind(this));
		this.socket.on('lock', this.lock.bind(this));
		this.socket.on('view', this.view.bind(this));
		this.socket.on('update', this.update.bind(this));

		IO.instances.push(this);
	}

	destructor() {
		console.log(`socket with id ${this.id} destructed`, this.query);

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

	static test() {
		io.emit('locked', { a: 1 });
	}

	async update(data) {
		console.log('client said update', data);

		await redisService.setAsync(data.id, JSON.stringify(data));

		io.emit('updated', data);
	}

	async view(data) {
		console.log('client said view', data);

		if (data.bool) {
			this.views[data.file.id] = data.file;
		} else {
			delete this.views[data.file.id];
		}

		// await redisService.setAsync(data.file.id, JSON.stringify({ ...data.file, viewed: data.bool }));

		this.socket.broadcast.emit('viewed', data);
	}

	async lock(data) {
		console.log('client said lock', data);

		if (data.bool) {
			this.locks[data.file.id] = data.file;
		} else {
			delete this.locks[data.file.id];
		}

		// await redisService.setAsync(data.file.id, JSON.stringify({ ...data.file, locked: data.bool }));

		this.socket.broadcast.emit('locked', data);
	}
}

io.on('connection', (socket) => new IO(socket));

module.exports = IO;
