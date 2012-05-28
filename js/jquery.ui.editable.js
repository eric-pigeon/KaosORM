"use strict";

(function ( $ ) {

$.widget('kaosORM.editable', {
	options : { },
	_create : function() {
		this.element.addClass('editable');
		var self = this;
		this.element.bind('dblclick.editable', function() {
			var $this = $(this);
			self.oldText = $this.html();
			$this.html('');
			self._createInput();
		});
	},
	destroy : function() {
		this.element.removeClass('editable').unbind('.editable');
	},
	_createInput : function() {
		var self = this;
		var input = $('<input type="text">').val( this.oldText ).addClass('editableInput');
		input.css({
			'text-align' : this.element.css('text-align')
		}).keydown(function (e) {
			if (e.keyCode == 13)
				self._endEdit();
			else if (e.keyCode == 27)
				self._cancelEdit();
		}).focusout(function (e) {
			self._endEdit();
		});
		this.element.append( input );
		input.focus();
	},
	_endEdit : function() {
		var newValue = this.element.children('input').val();
		this.element.children('input').remove();
		this.element.html( newValue );
	},
	_cancelEdit : function() {
		this.element.children('input').remove();
		this.element.html( this.oldText );
	}
});

})(jQuery);
