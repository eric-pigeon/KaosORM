(function($) {

var Entity;
KaosORM.Entity = Entity = function() {
	this.attributes = { };
	this.relationships = { };
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
		// todo recalculate height and width
		var i = 0;
		var relationshipName = "New Relationship";
		while(1) {
			if (this.relationships[relationshipName] === undefined) {
				break;
			}
			i++;
		relationshipName = "New Relationship"+i;
		}
		this.relationships[relationshipName] = new Relationship( this, relationshipName );
		this.element.find('.relationships > ul').append( this.relationships[relationshipName].element );
	},
	addAttribute : function() {
		this.element.find('.attributes > ul').append( $('<li>').html('New Attribute').editable() );
	}
};

var Relationship = function(entity, name) {
	this.entity = entity;
	this.element = $('<li>'+name+'</li>').editable();
};

Relationship.prototype = {

};

/*------------------------------------------
| On (Live) Bindings
|-----------------------------------------*/

/*-------------------------------------------
| Keep Entity Relationship Object and gui
| in sync
|------------------------------------------*/
$('#modelArea').on('editableedit', '.relationships > ul > li', function( event, data ) {
	var entity = $(this).closest('.entity').data('entity');
	entity.relationships[data['newValue']] = entity.relationships[data['oldValue']];
	delete entity.relationships[data['oldValue']];
});

/*-------------------------------------------
| Keep relationship and Property Names Unique
|------------------------------------------*/
$('#modelArea').on('editablevalidate', '.attributes li, .relationships li', function( event, data ) {
	var entity = $(this).closest('.entity').data('entity');
	if (entity.attributes[data['newValue']] !== undefined ||
			entity.relationships[data['newValue']] !== undefined) {
		KaosORM.prototype.instance.dialogError('Attribute and relationship names must be unique within an entity');
		return false;
	}
});

})(jQuery);
