<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>@yield('title')</title>
        <meta name="description" content="">
        <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1 minimal-ui">
        <link rel="shortcut icon" href="{{ asset('/favicon.ico') }}" type="image/x-icon" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <meta property="og:title" content="">
        <meta property="og:description" content="">
        <meta property="og:site_name" content="">
        <meta property="og:url" content="{{ URL::to('/') }}">
        <meta property="og:image" content="">
        <meta property="og:image:type" content="image/jpeg">
        <meta property="og:image:width" content="">
        <meta property="og:image:height" content="">

        <meta name="csrf-token" content="{{ csrf_token() }}">
        <base href="{{ URL::to('/') }}/"></base>
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" type="text/css" href="build/css/main.css">
    </head>
    <body>

        @yield('content')

        <script src="build/js/bundle.js"></script>    
        <script src="build/js/app.js"></script>

        @if (App::environment() === 'production')
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X');ga('send','pageview');
        </script>
        @endif

        @if (App::environment() === 'development')
        <script src="http://localhost:35729/livereload.js"></script>
        @endif
    </body>
</html>