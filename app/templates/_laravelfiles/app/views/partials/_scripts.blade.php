@if ($minified = (App::environment() === 'production' ? '.min' : false))
  {{ HTML::script('//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery' . $minified . '.js') }}
  {{ HTML::script('//ajax.googleapis.com/ajax/libs/angularjs/1.2.0-rc.2/angular' . $minified . '.js') }}
@else
  {{ HTML::script('js/libs/jquery/jquery' . $minified . '.js?' . filemtime(public_path() . '/js/libs/jquery/jquery' . $minified . '.js')) }}
  {{ HTML::script('js/libs/angular/angular' . $minified . '.js?' . filemtime(public_path() . '/js/libs/angular/angular' . $minified . '.js')) }}
@endif

<script>
  var app = angular.module('app', []);
</script>

@foreach (array('controllers', 'directives', 'services', 'models', 'filters') as $dir)
  @if (file_exists(public_path('/js/' . $dir) ))
    @foreach (new DirectoryIterator(public_path('/js/' . $dir)) as $entry)
      @if ($entry->isFile() && $entry->getExtension() === 'js')
        {{ HTML::script('js/' . $dir . '/' . $entry->getFilename() . '?' . filemtime(public_path('/js/' . $dir . '/' . $entry->getFilename()))) }}
      @endif
    @endforeach
  @endif
@endforeach