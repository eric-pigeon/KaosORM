"use strict";

var KaosORM;

(function($) {

	KaosORM = {};
	KaosORM.dataModels = [];
	KaosORM.activeDataModel;

	KaosORM.dialogError = function( message ) {
		$('<div>'+message+'</div>').attr('title', 'Error').dialog({
			modal : true,
			closeText : "",
 			buttons : [
				{
					text : "Okay",
					id : "defaultAction",
					click : function() {
						$(this).dialog("close");
					}
				}
			],
			close : function( event, ui ) {
				$(event.target).dialog('destroy').remove();
			}
		});
	};

	KaosORM.dialog = function( message ) {

	};
})(jQuery);

(function($) {
	$(document).on('newSelection', function(e) {
		$('#addPropertyButton').removeAttr('disabled');
	});

	$('#fileTabList').on('click', '.fileTab', function() {
		$(this).addClass('active');
	});
})(jQuery);

$(function() {
	KaosORM.activeDataModel = new KaosORM.DataModel();
	KaosORM.dataModels.push(KaosORM.activeDataModel); 
	$('#fileTabList').children(':first').addClass('active');

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
		KaosORM.activeDataModel.addEntity();
	});

	$('#addPropertyButton').click(function() {
		// props want to make a dialog here to prompt for type
		KaosORM.activeDataModel.gui.currentSelectedObject.data('entity').addProperty();
	});

	$('#addTabButton').click(function() {
		new KaosORM.DataModel();
	});

	$('#addPropertyButton').attr('disabled', 'disabled');

});
