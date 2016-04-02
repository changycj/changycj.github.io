
var player;

function onYouTubeIframeAPIReady() {

	player = new YT.Player('player', {
		height: '315',
		width: '560',
		videoId: '6AkX1ogq8KY',
		events: {
			'onReady' : startVideo
		}
	});
}

function startVideo() {
	
	// make sure the document is also ready
	$(document).ready(function() {

		var delays = [
			{ id: "s_1", delay: 114 },
			{ id: "s_2", delay: 114 },
			{ id: "s_3", delay: 123 },
			{ id: "s_4", delay: 130 },
			{ id: "s_5", delay: 135 },
			{ id: "s_6", delay: 143 },
			{ id: "s_7", delay: 148 },
			{ id: "s_8", delay: 148 }
		];

		player.playVideo();

		setInterval(function() {
			var time = player.getCurrentTime();

			delays.forEach(function(d, i) {
				if (d.delay <= time) {
					$("#" + d.id).fadeIn();
				} else {
					$("#" + d.id).fadeOut();
				}
			});

		}, 1000);
	});
}