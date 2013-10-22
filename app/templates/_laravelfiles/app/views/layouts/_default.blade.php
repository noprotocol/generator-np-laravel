<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!-- Consider adding a manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
 	<meta charset="utf-8">
	<!-- Use the .htaccess and remove these lines to avoid edge case issues. More info: h5bp.com/i/378 -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title></title>
	<meta name="description" content="">

	<!-- Mobile viewport optimized: h5bp.com/viewport -->
	<meta name="viewport" content="width=device-width">

	<!-- OG tags -->
	<meta property="og:title" content=""/>
	<meta property="og:type" content=""/>
	<meta property="og:url" content="<?php echo Request::url();?>"/>
	<meta property="og:image" content="<?php echo Request::root();?>/img/fb-share.png"/>
	<meta property="og:site_name" content=""/>
	<meta property="og:description" content=""/>

	<!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->

	{{ HTML::style('css/style.css'); }}

	<!-- More ideas for your <head> here: h5bp.com/d/head-Tips -->

	<!-- All JavaScript at the bottom, except this Modernizr build.
	Modernizr enables HTML5 elements & feature detects for optimal performance.
	Create your own custom Modernizr build: www.modernizr.com/download/ -->

	<!--<script src="js/libs/modernizr-2.5.3.min.js"></script>-->
</head>
<body class="">
	
	<script>
		var _gaq=[['_setAccount','UA-30655437-1'],['_trackPageview']];
		(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
		g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
		s.parentNode.insertBefore(g,s)}(document,'script'));
	</script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
	{{ HTML::script('js/app.js') }}
</body>
</html>