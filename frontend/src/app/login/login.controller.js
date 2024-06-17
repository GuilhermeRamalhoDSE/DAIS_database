angular.module('frontend').controller('LoginController', ['$scope', 'AuthService', '$state', function($scope, AuthService, $state) {
    $scope.credentials = {
        email: '',
        password: '',
        rememberMe: false
    };

    $scope.login = function() {
        AuthService.login($scope.credentials).then(function() {
            if (AuthService.isSuperuser()) {
                $state.go('base.home-su');
            } else if (AuthService.isStaff()) {
                $state.go('base.home-admin');
            }
        }, function(error) {
            alert('Login failed!');
            console.error(error);
        });
    };
}]);
