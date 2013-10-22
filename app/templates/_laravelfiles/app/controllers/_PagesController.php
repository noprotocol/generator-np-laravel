<?php

class PagesController extends BaseController {
	
	protected $layout = 'layouts.default';

	function index() {
		$view = View::make('pages.index');
		return $view;
	}
}