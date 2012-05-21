/**
 * Wizziwig core plugin.
 *
 * Do not interact with the Wizziwig instance until the wizziwigpreinit event is
 * called.  In some browsers, the initialization process may not happen
 * synchronously.
 *
 * Events:
 * wizziwigpreinit -- Called when editor iframe is loaded, but before any
 *                    content is populated
 * wizziwigpostinit -- Called after the editor iframe is populated with content
 */
(function()
{
	var WIDGET = {}

	/**
	 * Create widget instance.
	 */
	WIDGET._create = function()
	{
		/**
		 * Base container element that holds the Wizziwig UI.
		 * @type jQuery
		 */
		this.container = $('<div>').addClass(this.widgetBaseClass);

		/**
		 * Menu toolbar list element.
		 * @type jQuery
		 */
		this.menu = $('<ul>').appendTo(this.container);

		/**
		 * The editor iframe that holds the area where content can be edited.
		 * @type jQuery
		 */
		this.iframe = $();

		/**
		 * Shortcut for accessing the editor iframe's document object.
		 * @type Document
		 */
		this.document = null;

		/**
		 * Shortcut for accessing the editor iframe's window object.
		 * @type Window
		 */
		this.window = null

		/**
		 * Shortcut for accessing the editor iframe's <body> element.
		 * @type jQuery
		 */
		this.body = $();

		this.element.hide().after(this.container);
	};

	/**
	 * Initialize widget instance.
	 */
	WIDGET._init = function()
	{
		// Need to wait for load event -- Firefox replaces the iframe's document
		// with a different one as it is loading about:blank, and it doesn't do
		// this right away
		var that = this;

		this.iframe = $('<iframe>')
			.on('load', function()
			{
				that.document = this.contentDocument;
				that.window = this.contentWIndow;
				that.body = $(that.document.body);

				that._trigger('preinit');
				that.body.append($(that.element.text()));
				that.toggle();
				that._trigger('postinit');
			})
			.appendTo(this.container);
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
