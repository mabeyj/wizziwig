$(function()
{
	module('Initialization');

	test('Content populated', function()
	{
		$('textarea').wizziwig();

		strictEqual(
			$('textarea').data('wizziwig.wizziwig').body.html(),
			'<p>Content</p>'
		);
	});

	asyncTest('Events', function()
	{
		$('textarea')
			.on('wizziwigpreinit', function()
			{
				start();
				ok(true, 'Got pre-init');
				stop();
			})
			.on('wizziwigpostinit', function()
			{
				start();
				ok(true, 'Got post-init');
			})
			.wizziwig();
	});
});
