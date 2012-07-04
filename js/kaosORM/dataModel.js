(function( $ ) {

var DataModel = function() {
	this.entities = { };
	this.gui = {
		currentSelectedObject : null
	};
	this.element = $('<li class="fileTab">Untitled</li>');
	this.element.appendTo( $('#fileTabList') ).addClass('transitioned');
};

DataModel.prototype = {
	addEntity : function() {
		var i = 0;
		var entityName = "Entity";
		while(1) {
			if (this.entities[entityName] === undefined) {
				break;
			}
			i++;
			entityName = "Entity"+i;
		}
		this.entities[entityName] = new KaosORM.Entity(entityName);
	}
};

KaosORM.DataModel = DataModel;

})(jQuery);
