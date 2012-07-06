(function ($) {
	$(document).on('keydown', function(e) {
		e.stopImmediatePropagation();
		if (e.keyCode == 13 && $('#defaultAction:enabled').length)
			$('#defaultAction').click();
	});
})(jQuery);
