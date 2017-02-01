var grandPianoControllers = angular.module('grandPianoControllers', []);

grandPianoControllers.controller('MainController', ['$scope', '$routeParams', '$http', '$timeout', function($scope, $routeParams, $http, $timeout) {
    $scope.title = "Grand Piano Yay"
}]);
