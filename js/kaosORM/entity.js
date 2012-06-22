(function($) {

var Entity;
KaosORM.Entity = Entity = function() {
	this._createHTML();
	return this;
}

Entity.prototype = {
	_createHTML : function() {
		var self = this;
		this.element = $('<div class="entity">');
		var title = $('<div class="title">Entity</div>').editable();
		var attributes = $('<div class="attributes">Attributes<ul></ul></div>');
		var relationships = $('<div class="relationships">Relationships<ul></ul></div>');
		this.element.append(title).append(attributes).append(relationships);

		$('#modelArea').append(this.element);
		this.element.css({
			top : ($('#modelArea').innerHeight() / 2),
			left : ($('#modelArea').innerWidth() / 2),
			'margin-top' : -(this.element.outerHeight() / 2),
			'margin-left' : -(this.element.outerWidth() / 2)
		}).connectable({
			drawableArea : '#modelArea'	
		}).draggable();

		this.element.bind('connectablenewconnection', function() {
			self.newRelationship();
		});

		this.element.data('entity', this);
	},
	newRelationship : function() {
		this.element.find('.relationships > ul').append( $('<li>').html('New Relationship').editable() );
	},
	addAttribute : function() {
		this.element.find('.attributes > ul').append( $('<li>').html('New Attribute').editable() );
	}
};

})(jQuery);
