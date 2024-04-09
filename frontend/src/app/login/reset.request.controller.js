angular.module('frontend').controller('PasswordResetRequestController', ['$scope', 'PasswordResetService', '$state', function($scope, PasswordResetService, $state) {
    $scope.email = '';
    
    $scope.requestReset = function() {
        PasswordResetService.requestReset($scope.email).then(function(response) {
            alert("If a user with this email exists, a password reset link has been sent.");
            $state.go('login'); 
        }, function(error) {
            alert("Failed to request password reset!");
            console.error(error);
        });
    };
}]);
