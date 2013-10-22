App::before(function($request)
{
	View::composer('*', 'AppComposer');
});