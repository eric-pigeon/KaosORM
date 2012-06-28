(function ($) {
	$(document).on('keydown', function(e) {
		e.stopImmediatePropagation();
		if (e.keyCode == 13 && $('#defaultAction').length)
			$('#defaultAction').click();
	});
})(jQuery);
