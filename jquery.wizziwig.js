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

		// IE7 and IE8 need frameBorder to completely remove the border
		this.iframe = $('<iframe>')
			.attr('frameBorder', 0)
			.on('load', function()
			{
				// IE7 does not have contentDocument, only window.document
				that.window = this.contentWindow;
				that.document = that.window.document;
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

	/**
	 * Return the position of the cursor.
	 *
	 * The following object is returned:
	 *
	 * {
	 *     "node": Text,
	 *         The text node in which the cursor is found.
	 *
	 *     "offset": INTEGER,
	 *         Position offset.  0 means the cursor is at the beginning of the
	 *         text node, before the first character.  If the offset is equal to
	 *         the length of the node, then the cursor is at the end of the text
	 *         node, after the last character.
	 * }
	 *
	 * @return {object}
	 */
	WIDGET.cursorPosition = function()
	{
		if (this.SUPPORT_SELECTIONS)
		{
			var selection = this.window.getSelection()
			return {node: selection.focusNode, offset: selection.focusOffset};
		}
		else
		{
			// IE7 and IE8 support

			var old_range = this.document.selection.createRange();
			var range = old_range.duplicate();

			// Insert a cursor element where the current selection ends.  Note
			// that if a selection is made, this will assume the cursor is at
			// the rightmost end of the selection, which may not necessary be
			// where the cursor is if the user made the selection in reverse.
			range.collapse(false);
			range.select()
			range.pasteHTML('<span class="' + this.CLASS_CURSOR + '">|</span>');

			old_range.select();

			// By inserting an element, we will split a text node into two.
			// Thus we can find a reference text node and the offset is either
			// the beginning or end of that node.  This selection API does not
			// have another way to determine the offset.
			var result = {}
			var cursor_ele = $('.' + this.CLASS_CURSOR, this.body);
			var parent_contents = cursor_ele.parent().contents();

			var that = this;
			parent_contents.each(function(i)
			{
				if ($(this).is('.' + that.CLASS_CURSOR))
				{
					if (i > 0)
					{
						result.node = parent_contents[i - 1];
						result.offset = result.node.length;
					}
					else
					{
						result.node = parent_contents[i + 1];
						result.offset = 0;
					}

					return false;
				}
			});

			cursor_ele.remove();
			return result;
		}
	};

	$(function()
	{
		$.widget('wizziwig.wizziwig', WIDGET);

		var proto = $.wizziwig.wizziwig.prototype;

		/**
		 * Namespaced class names used by the Wizziwig core.
		 *
		 * CLASS_CURSOR (wizziwig-wizziwig-cursor) -- an element with this class
		 *     is used to determine the position of the cursor for legacy
		 *     browsers
		 */
		proto.CLASS_CURSOR = proto.widgetBaseClass + '-cursor';

		/**
		 * Constants representing support status of certain browser features.
		 *
		 * SUPPORT_SELECTIONS -- true if HTML Editing API selections are
		 *                       supported
		 */
		proto.SUPPORT_SELECTIONS = Boolean(window.getSelection);
	});
})(jQuery);
