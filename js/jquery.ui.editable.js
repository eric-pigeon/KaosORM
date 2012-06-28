"use strict";

(function ( $ ) {

$.widget('kaosORM.editable', {
	options : {
		validate: null,
		edit: null	
	},
	_create : function() {
		this.element.addClass('editable');
		var self = this;
		this.element.on('dblclick.editable', function(e) {
			var $this = $(this);
			if ($this.find('input').length != 0)
				return;
			self.oldValue = $this.html();
			$this.html('');
			self._createInput();
		});
	},
	destroy : function() {
		this.element.removeClass('editable').unbind('.editable');
	},
	_createInput : function() {
		var self = this;
		var input = $('<input type="text">').val( this.oldValue ).addClass('editableInput');
		input.css({'text-align':this.element.css('text-align')})
				.on('focusout keydown', function(e) {
					e.stopImmediatePropagation();
					if ( e.type == "fucosout" || e.keyCode == $.ui.keyCode.ENTER ) {
						self._endEdit();
					}
					if ( e.keyCode == $.ui.keyCode.ESCAPE ) {
						self._cancelEdit();
					}
				});
		this.element.append( input );
		input.focus();
	},
	_endEdit : function() {
		var newValue = this.element.children('input').val();
		if (this._trigger('validate', null, {uiObject: this, newValue: newValue })) {
				this._doEdit();
		} else {
			this._cancelEdit();
		}
	},
	_doEdit : function() {
		var newValue = this.element.children('input').val();
		this.element.children('input').remove();
		this.element.html( newValue );
		this._trigger('edit', null, {
			uiObject : this,
			oldValue : this.oldValue,
			newValue : newValue
		});
	},
	_cancelEdit : function() {
		this.element.children('input').remove();
		this.element.html( this.oldValue );
	}
});

})(jQuery);
