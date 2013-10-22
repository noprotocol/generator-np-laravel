<?php

class AppComposer {

    public function compose($view)
    {
    	//fallbacks
		$controller = 'undefined';
		$action = 'undefined';

		$route = Route::currentRouteAction();

		if(!empty($route)) {
			//get the current controller/action string
			$route = explode('@', Route::currentRouteAction());

			//strip the 'Controller' from the controller name and lowercase the rest
			$controller = strtolower($route[0]);        	
			$controller = str_replace('controller', '', $controller);
			$action = $route[1];
		}

        $view->with(array('controller' => $controller, 'action' => $action));
    }
}