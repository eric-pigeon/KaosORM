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

	KaosORM.dialog = function( title, body, buttons ) {
		$('<div>').attr('title', title).append(body).dialog({
			modal : true,
			closeText : "",
			buttons : buttons
		});
	};

	// these are just place holders, determine real data types later
	KaosORM.propertyDataTypes = [
		'String', 'Float', 'Int', 'UUID'
	];
})(jQuery);

(function($) {
	$(document).on('newSelection', function(e) {
		$('#addAttributeButton').removeAttr('disabled');
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

	$('#addAttributeButton').click(function() {
		var name = $('<input type="text" id="attributeNameInput" placeholder="Entity Name"/>').on('keydown keyup change', function() {
			if( name.val().length ) {
				$('#defaultAction').removeAttr('disabled');
			} else {
				$('#defaultAction').attr('disabled', 'disabled');
			}
		});
		var typeSelect = $('<select id="attributeTypeSelect">');
		$.each(KaosORM.propertyDataTypes, function( i, type ) {
			typeSelect.append( $('<option>'+type+'</option>') );
		});
		KaosORM.dialog(
			'New Property',
			$('<label for="attributeNameInput">Attribute Name:</label>').add(name).add($('<label for="attributeTypeSelect">Attribute Type:</label>')).add(typeSelect),
			[
				{
					text : "Cancel",
					click : function() {
						$(this).dialog("close");
					}
				},
				{
					text : "Okay",
					id : "defaultAction",
					disabled : 'disabled',
					click : function() {
						KaosORM.activeDataModel.gui.currentSelectedObject.data('entity').addAttribute(name.val(), typeSelect.val());
						$(this).dialog("close");
					}
				}
			]
		);
	});

	$('#addTabButton').click(function() {
		new KaosORM.DataModel();
	});

	//$('#addPropertyButton').attr('disabled', 'disabled');
});
