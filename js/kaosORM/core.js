"use strict";

var KaosORM;

(function($) {
	KaosORM = function() {
		if (this.instance != null)
			return this.instance;
		KaosORM.prototype.instance = this;
	};

	KaosORM.prototype = {
		instance : null
	};
})(jQuery);


$(function() {
	var kaosORM = new KaosORM();


	// this kinda works but needs to be fixed and cleaned up
	$('#rightSideBarSepperator').mousedown(function(e) {
		$(document).bind('mouseup.resizeSideBar', function() {
			$('#mainContent').unbind('.resizeSideBar');
			$(document).unbind('.resizeSideBar');
		});
		var lastX = e.pageX;
		$('#mainContent').bind('mousemove.resizeSideBar', function(eventObject) {
			var deltaX = lastX - eventObject.pageX;
			$('#rightSideBar').css('width', '+='+deltaX);
			lastX = eventObject.pageX;
		});
	});

	$('#addEntityButton').click(function() {
		new KaosORM.Entity();
	});


});
