angular.module('frontend').controller('ErrorController', ['$scope', '$state', function($scope, $state) {
    $scope.goHome = function() {
        $state.go('base.home'); 
    };
}]);
