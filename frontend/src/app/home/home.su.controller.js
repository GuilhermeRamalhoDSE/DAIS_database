angular.module('frontend').controller('HomeSUController', ['$scope', 'AuthService', '$state', function($scope, AuthService, $state) {
    $scope.isOnlyStaff = AuthService.isOnlyStaff;
    
    $scope.logout = function() {
        AuthService.logout();
        $state.go('login');
    };
}]);
