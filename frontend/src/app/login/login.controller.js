angular.module('frontend').controller('LoginController', ['$scope', 'AuthService', '$state', function($scope, AuthService, $state) {
    $scope.credentials = {
        email: '',
        password: '',
        rememberMe: false
    };

    $scope.login = function() {
        AuthService.login($scope.credentials).then(function() {
            $state.go('base.home');
        }, function(error) {
            alert('Login failed!');
            console.error(error);
        });
    };
}]);
