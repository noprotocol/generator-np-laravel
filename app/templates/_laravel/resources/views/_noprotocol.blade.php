@extends('layouts.default')

@section('title', 'NoProtocol Laravel 5')

@section('content')
    <link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:700' rel='stylesheet' type='text/css'>
	<style>
		body {
			margin: 0;
			padding: 0;
			width: 100%;
			height: 100%;
			color: #B0BEC5;
			display: table;
			font-weight: 100;
			font-family: 'Open Sans Condensed', verdana, sans-serif;
		}

		.container {
			position: fixed;
			top: 50%;
			left: 50%;
			text-align: center;
			-webkit-transform: translate(-50%, -50%);
			  -ms-transform: translate(-50%, -50%);
			      transform: translate(-50%, -50%);
		}

		.logo {
			margin-bottom: 20px;
		}

		.version {
			font-size: 20px;
			letter-spacing: 1.3px;
		}
	</style>
	<div class="container">
		<div class="content">
			<div class="logo">
				<a href="http://noprotocol.nl" width="500" height="46" title="noprotocol.nl">
					<img src="img/noprotocol-logo.png" alt="NoProtocol Logo" title="Noprotocol">
				</a> 
			</div>
			<div class="version">Built on Laravel {{ $version }} running on {{ $environment }} environment</div>
		</div>
	</div>
@stop