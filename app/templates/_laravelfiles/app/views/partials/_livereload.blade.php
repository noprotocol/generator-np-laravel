@if (App::environment() === 'development')
    <!--[if gt IE 8]> -->
    {{ HTML::script('http://'.$_SERVER['SERVER_NAME'].':35729/livereload.js') }}
    <!-- <![endif]-->
@endif