angular.module('frontend').controller('UserUpdateController', ['$scope', '$state', 'UserService', 'AuthService', function($scope, $state, UserService, AuthService) {
    $scope.formUser = {};
    $scope.isEditing = true;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenses = [];

    $scope.getAllLicenses = function() {
        UserService.getAllLicenses().then(function(response) {
            $scope.licenses = response.data.map(function(license) {
                return {
                    id: license.id,
                    name: license.name
                };
            });
        }).catch(function(error) {
            console.error('Error fetching licenses:', error);
        });
    };

    $scope.loadUser = function() {
        const userId = $state.params.userId;
        UserService.getUserById(userId).then(function(response) {
            if (response.data && response.data.length > 0) {
                $scope.formUser = response.data[0];
                $scope.formUser.license_id = response.data[0].license_id;
            } else {
                $state.go('base.user-view');
            }
        }).catch(function(error) {
            console.error('Error fetching user:', error);
        });
    };

    $scope.togglePasswordVisibility = function() {
        $scope.showPassword = !$scope.showPassword;
    };
    
    $scope.updateUser = function() {
        var userDataToUpdate = {
            first_name: $scope.formUser.first_name,
            last_name: $scope.formUser.last_name,
            email: $scope.formUser.email,
            is_staff: $scope.formUser.is_staff,
            license_id: $scope.formUser.license_id
        };

        if (!$scope.isSuperuser) {
            userDataToUpdate.license_id = AuthService.getLicenseId();
        }

        UserService.updateUser($scope.formUser.id, userDataToUpdate).then(function(response) {
            alert('User updated successfully');
            $state.go('base.user-view'); 
        }).catch(function(error) {
            console.error('Error updating user:', error);
            alert('Failed to update user'); 
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.user-view');
    };

    $scope.loadUser(); 
    $scope.getAllLicenses();
}]);
