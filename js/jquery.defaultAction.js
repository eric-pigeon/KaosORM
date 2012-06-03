(function ($) {
	$(document).bind('keyup', function(e) {
		if (e.keyCode == 13 && $('#defaultAction').length)
			$('#defaultAction').click();
	});
})(jQuery);
