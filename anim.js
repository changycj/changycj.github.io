$(document).ready(function() {
	var items = ["s_1", "s_2", "s_3", "s_4", "s_5", "s_6", "s_7", "s_8"];
	var delays = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000];

	for (var i = 0; i < items.length; i++) {
		$("#" + items[i]).delay(delays[i]).fadeIn(600);
	}
})