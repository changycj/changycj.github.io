$(document).ready(function() {
	var items = ["s_1", "s_2", "s_3", "s_4", "s_5", "s_6", "s_7", "s_8"];
	var delays = [115000, 116000, 124000, 132000, 136000, 140000, 145000, 150000];

	for (var i = 0; i < items.length; i++) {
		$("#" + items[i]).delay(delays[i]).fadeIn(600);
	}
})