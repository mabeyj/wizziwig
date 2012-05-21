(function()
{
	var WIDGET = {}

	/**
	 * Create widget instance.
	 */
	WIDGET._create = function()
	{
		this.container = $('<div>').addClass(this.widgetBaseClass);
		this.menu = $('<ul>').appendTo(this.container);
		this.iframe = $('<iframe>').appendTo(this.container);

		// Insert everything now so that the iframe gets populated with a blank
		// document
		this.element.hide().after(this.container);

		this.document = $(this.iframe.prop('contentDocument').documentElement);
		this.body = $('body', this.document);
	};

	/**
	 * Initialize widget instance.
	 */
	WIDGET._init = function()
	{
		this._trigger('preinit');

		$('body', this.document).append($(this.element.text()));
		this.toggle();

		this._trigger('postinit');
	};

	/**
	 * Toggle editability state of the WYSIWYG.
	 *
	 * @param {Boolean} state  Set state to this value (optional)
	 */
	WIDGET.toggle = function(state)
	{
		if (state === undefined)
		{
			state = !Boolean(this.body.attr('contenteditable'));
		}

		this.body.attr('contenteditable', Boolean(state));
	};

	$(function()
	{
		$.widget('wizziwig.wizziwig', WIDGET);
	});
})(jQuery);
