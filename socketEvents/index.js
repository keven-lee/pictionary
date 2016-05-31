var game = require('../game');

module.exports = function(socket) {
	var word = game.getWord();
	console.log('New client connected');

	socket.on('draw', function(position) {
		socket.broadcast.emit('draw', position);
	});

	socket.on('guess', function(guess) {
		socket.broadcast.emit('guess', guess);
	});

	socket.on('claim pen', function(){
		socket.isInDrawMode = true;
		socket.emit('drawer', word);
		socket.broadcast.emit('pen claimed');
	});

	socket.on('disconnect', function() {
		if (socket.isInDrawMode) {
			console.log('A drawer disconnected');
			socket.broadcast.emit('pen open');
		} else {
			console.log('A guesser disconnected');
		}
	});
};
