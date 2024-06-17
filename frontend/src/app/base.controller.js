angular.module('frontend').controller('BaseController', ['$scope', 'AuthService', 'UserService', '$state', function($scope, AuthService, UserService, $state) {
    $scope.isOnlyStaff = AuthService.isOnlyStaff;
    var userId = AuthService.getUserId();
    $scope.lastLogin = AuthService.getLastLogin();
    var licenseId = AuthService.getLicenseId();
    
    $scope.logout = function() {
        AuthService.logout();
        $state.go('login');
    };

    if (userId) {
        UserService.getUserById(userId)
            .then(function(response) {
                var user = response.data[0];
                $scope.userName = user.first_name + ' ' + user.last_name;
            })
            .catch(function(error) {
                console.error('Error fetching user details:', error);
            });
    }

}]);
