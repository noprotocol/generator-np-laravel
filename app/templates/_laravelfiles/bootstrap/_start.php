$env = $app->detectEnvironment(function()
{
	//set the default application environment
	$env = 'production';

	//if application env is set through .htaccess or a server configuration, set that env as the app env
	if(isset($_SERVER['APPLICATION_ENV'])) {
		$env = $_SERVER['APPLICATION_ENV'];
	}

    return $env;
});