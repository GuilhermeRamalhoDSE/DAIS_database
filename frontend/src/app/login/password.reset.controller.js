angular.module('frontend').controller('PasswordResetController', ['$scope', 'PasswordResetService', '$stateParams', '$state', function($scope, PasswordResetService, $stateParams, $state) {
    $scope.newPassword = '';
    $scope.token = $stateParams.token; 
    
    $scope.resetPassword = function() {
        PasswordResetService.resetPassword($scope.token, $scope.newPassword).then(function(response) {
            alert("Password reset successful.");
            $state.go('login');
        }, function(error) {
            alert("Invalid or expired token.");
            console.error(error);
        });
    };
}]);
