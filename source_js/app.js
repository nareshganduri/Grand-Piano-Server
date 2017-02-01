var app = angular.module('grandPiano', ['ngRoute', 'grandPianoControllers']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/landing', {
    templateUrl: 'partials/landing.html',
    controller: 'MainController'
  }).
  otherwise({
    redirectTo: '/landing'
  });
}]);