var pictionary = function() {
	var socket = io();

	var canvas = $('canvas');
	var context = canvas[0].getContext('2d');

	var isInDrawMode = false;
	var isDrawing = false;

	canvas[0].width = canvas[0].offsetWidth;
	canvas[0].height = canvas[0].offsetHeight;

	function draw(position) {
		context.beginPath();
		context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
		context.fill();
	};

	function clearCanvas() {
		context.clearRect(0, 0, canvas[0].width, canvas[0].height);
	}

	function displayWord(word) {
		isInDrawMode = true;
		$('#word').text('You\'re the drawer. Draw a ' + word + '!').css('display', 'block');
		$('#guess').hide();
	}

	function onKeyDown(event) {
		if (event.keyCode != 13) { // If NOT enter/return key
			return;
		}

		var guess = $('#guess').val();
		console.log(guess);
		socket.emit('guess', guess);
		addGuess(guess);
		$('#guess').val('');
	};

	function addGuess(guess) {
		var guesses = $('#guess-list').text();
		$('#guess-list').text(guesses + guess + ', ');
	};

	// JQuery Listeners

	$('#clear').on('click', clearCanvas);

	$('#guess').on('keydown', onKeyDown);

	canvas.on('mousedown', function() {
		if (isInDrawMode) {
			isDrawing = true;
		}
	});

	canvas.on('mouseup', function() {
		isDrawing = false;
	});

	canvas.on('mousemove', function(event) {
		var offset = canvas.offset();
		var position = {
			x: event.pageX - offset.left,
			y: event.pageY - offset.top
		};
		if (isDrawing) {
			draw(position);
			socket.emit('draw', position);
		}
	});

	$('#claim').on('click', function() {
		socket.emit('claim pen');
		$(this).hide();
	});

	// Socket.io listeners

	socket.on('draw', function(position) {
		draw(position);
	});

	socket.on('guess', addGuess);

	socket.on('pen claimed', function() {
		$('#claim').hide();
	});

	socket.on('pen open', function() {
		$('#claim').show();
		$('#guesses').hide();
	});

	socket.on('drawer', displayWord);

}; // End pictionary()

$(document).ready(function(){
	pictionary();
});
