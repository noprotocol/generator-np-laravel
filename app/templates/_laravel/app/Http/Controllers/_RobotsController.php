<?php namespace App\Http\Controllers;

class RobotsController extends Controller {

	/*
	|--------------------------------------------------------------------------
	| Robots Controller
	|--------------------------------------------------------------------------
	|
	| Returns the correct content for a robots.txt based on the environment.
	|
	*/

	/**
	 * By default, every environment returns 'Disallow: /' (disallowing everything) except production which returns 'Disallow: ' (allow everything)
	 * If you want to disallow files/folders for production, add them to the $disallowedItems array.
	 * @return Response the plain text robots.txt response
	 */
	public function index()
	{	
		$robot = 'User-agent: *' . PHP_EOL;

		// Disallowed files/folders on production environment
		$disallowedItems = [];

		// append extra dissallowed items here
		// $disallowedItems[] = 'foo/bar';
		
		if(app()->environment() !== 'production') {
			// not environment production, dissallow everything
			$robot .= 'Disallow: /' . PHP_EOL;
		} else {

			// if there are no dissallowed items, return an empty string of the item ('Disallow: ') equals allow everything
			if(count($disallowedItems) === 0) {
				$robot .= 'Disallow: ' . PHP_EOL;
			}

			foreach ($disallowedItems as $item) {
				$robot .= 'Disallow: ' . $item . PHP_EOL;
			}
		}

		return \Response::make($robot, 200, array('content-type' => 'text/plain'));
	}
}
