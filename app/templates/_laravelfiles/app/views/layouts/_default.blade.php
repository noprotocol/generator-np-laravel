<!DOCTYPE html>
<html>
<head>
  <title></title>
 	<meta charset="utf-8">
	{{ HTML::style('css/main.css') }}
</head>
<body>
	@yield('content')
  @include('partials.livereload')
</body>
</html>