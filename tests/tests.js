$(function()
{
	module('Initialization');

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

	asyncTest('Content populated', function()
	{
		$('textarea')
			.on('wizziwigpostinit', function()
			{
				start();
				strictEqual(
					$($('iframe').prop('contentDocument').body).html(),
					'<p>Content</p>'
				);
			})
			.wizziwig()
	});
});
