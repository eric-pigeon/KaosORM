(function( $ ) {

// extend the jQuery eventObject to have relativeMousePosition
$.Event.prototype.relativeMousePosition = function() {
	var positionX;
	var positionY;
	if (this.pageX || this.pageY) { 
	  positionX = this.pageX;
	  positionY = this.pageY;
	} else {
		positionX = this.clientX + $('body').scrollLeft() + $('html').scrollLeft();
		positionY = this.clientY + $('body').scrollTop() + $('html').scrollTop(); 
	}
	positionX -= $(this.delegateTarget).offset().left;
	positionY -= $(this.delegateTarget).offset().top;
	return {left:positionX, top:positionY};
};

/*---------------------------------------
| Line Object
|--------------------------------------*/

var Line = function( origin ) {
	this.endPoints.origin = origin;
	this.element = $('<div>').attr({
		class : 'line',
		id		: 'drawingLine'
	}).css(
		origin._getElementOrigin()
	).appendTo( origin.drawableArea );
};

Line.prototype = {
	endPoints : {},
	drawTo : function(p) {
		var lineOrigin = {left : parseFloat(this.element.css('left')), top : parseFloat(this.element.css('top')) };
		var deltaX = p.left-lineOrigin.left;
		var deltaY = lineOrigin.top-p.top;
		var tangent = this._vectorLength({x:deltaX,y:deltaY});
		//calculate offset
		var isocelesLength = tangent*Math.sin(Math.asin(deltaY/tangent)/2);
		var rotationRadians = Math.asin(deltaY/tangent);
		var otherAngles = (Math.PI-rotationRadians)/2;
		var offsetAngle = otherAngles+(Math.PI/2);
		var offsetX = isocelesLength*Math.sin(offsetAngle);
		var offsetY = isocelesLength*Math.cos(offsetAngle);
		if (deltaX < 0) {
			offsetX -= deltaX;
		}
		this.element.css({
			width : tangent,
			transform : 'matrix('+(deltaX/tangent)+','+(-(deltaY/tangent))+','+(deltaY/tangent)+','+(deltaX/tangent)+','+(-offsetX)+','+(offsetY)+')'
		});

	},
	setEnd : function(c) {
		if (this.endPoints.end == c)
			return;
		this.element.css( this.endPoints.end._getElementOrigin() );
		this.endPoints = { origin : this.endPoints.end, end : c };
		this.drawTo( c._getElementOrigin() );
	},
	_vectorLength : function(v) {
		var sum = 0;
		for (var part in v) {
			sum += Math.pow(v[part], 2);
		}
		return Math.sqrt(sum);
	}
};

/*---------------------------------------
| Static Variables
|--------------------------------------*/
var connectionStarted = false;
// reference to the current line for any active drawing
var line = null;

$.widget('kaosORM.connectable', $.ui.mouse, {
	options : {
		drawableArea : 'parent'
	},
	_create : function() {
			this._mouseInit();
			this.element.addClass('connectable');
			if (this.options.drawableArea === 'parent') {
				this.drawableArea = this.element.parent();
			} else {
				this.drawableArea = $(this.options.drawableArea);
			}
			this.lines = [];
	},
	destroy : function() {
		this._mouseDestroy();
	},
	_removeDrawingBindings : function() {
		$('.connectableDrawing').unbind('.connectableDrawing').removeClass('connectableDrawing');
	},
	_mouseDown : function(e) {
		var self = this;
		if (!e.altKey && !e.metaKey)
			return;
		e.stopImmediatePropagation();
		if (connectionStarted) {
			this._stopNewConnection();
		} else {
			this._startConnection();
			// TODO fix this and move it to startConnection
			this._tempBind( $('body'), 'connectableDrawing', 'keyDown', self._cancelConnection );
		}
	},
	_getElementOrigin : function() {
		var origin = {};
		switch (this.element.css('position')) {
			case 'absolute':
				var position = this.element.position();
				var width = this.element.width();
				var height = this.element.height();
				origin = {left:position.left+(width/2),top:position.top+(height/2)};
				break;
		}
		var margin = this.element.css('margin');
		if (margin != null) {
			margin = margin.split(' ');
			for( var axis in margin ) {
				margin[axis] = parseFloat(margin[axis]);
			}
			origin.left += margin[3];
			origin.top += margin[0];
		}
		return origin;
	},
	_startConnection : function() {
		connectionStarted = true;
		line = new Line( this );
		// TODO this shouldn't be added to the lines until the connection is complete
		this.lines.push( line );
		// make the drawAble area interactive
		this._tempBind( this.drawableArea, 'connectableDrawing', 'mousemove', function(e) {
			line.drawTo( e.relativeMousePosition() );
		});
		// make other connectables 'snap'
		this._tempBind( $('.connectable'), 'connectableDrawing', 'mousemove', function(e) {
			line.drawTo( $(this).data('connectable')._getElementOrigin() );
			e.stopImmediatePropagation();
		});
	},
	_stopNewConnection : function() {
		connectionStarted = false;
		line.element.removeAttr('id');
		this._removeDrawingBindings();
		// and the line to both connectables line array
		this.lines.push( line );
		// and this to the line endpoints
		line.endPoints.end =  this;
		// if this is drug we need to update the line
		$(this.element).add(line.endPoints.origin.element).bind('dragstart', function(e) {
			var self = $(this).data('connectable');
			for ( var i in self.lines ) {
				var line = self.lines[i];
				line.setEnd( self );
			}
		}).bind('drag', function(e) {
			var self = $(this).data('connectable');
			for( var i in self.lines) {
				var line = self.lines[i];
				self.lines[i].drawTo(self._getElementOrigin());
			}	
		});
	},
	_cancelConnection : function(e) {
		if (e.keyCode == 27) {
			this._removeDrawingBindings();
			$('#drawingLine').remove();
		}
	},
	/*------------------------------------------
	| Helper functions
	|-----------------------------------------*/
	_tempBind : function( jQueryObject, namespace, event, eventData, handler ) {
		jQueryObject.addClass(namespace).bind( event+'.'+namespace, eventData, handler );
	}

});

})(jQuery);
