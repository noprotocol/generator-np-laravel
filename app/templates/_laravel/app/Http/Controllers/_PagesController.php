<?php namespace App\Http\Controllers;

class PagesController extends Controller {

	/*
	|--------------------------------------------------------------------------
	| Pages Controller
	|--------------------------------------------------------------------------
	|
	| This controller renders your application's static pages such as the NoProtocol splash screen
	|
	*/

	/**
	 * Show the splash screen for the proejct generated via Yeoman
	 *
	 * @return Response
	 */
	public function noprotocol()
	{
		$app = app();
		return view('noprotocol')->with(['version' => $app->version(), 'environment' => $app->environment()]);
	}

}
