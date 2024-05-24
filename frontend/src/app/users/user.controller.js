angular.module('frontend').controller('UserController', ['$scope', 'UserService', '$state', 'AuthService', 'LicenseService', '$location', function($scope, UserService, $state, AuthService, LicenseService, $location) {
    $scope.users = [];
    $scope.formUser = {};
    $scope.isEditing = false;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.userName = '';

    $scope.showPassword = false;


    $scope.getAllUsers = function() {
        UserService.getAllUsers().then(function(response) {
            $scope.users = response.data;
        }).catch(function(error) {
            console.error('Error fetching users:', error);
        });
    };

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

    $scope.fetchUserDetails = function() {
        var userId = AuthService.getUserId();
        if (userId) {
            UserService.getUserById(userId).then(function(response) {
                var user = response.data[0]; 
                $scope.userName = user.first_name + ' ' + user.last_name;
            }).catch(function(error) {
                console.error('Error fetching user details:', error);
            });
        }
    };

    $scope.isHomePage = function() {
        return $location.path() === '/home';
    };
    
    $scope.togglePasswordVisibility = function() {
        $scope.showPassword = !$scope.showPassword;
    };      

    $scope.initForm = function() {
        if (!$scope.isSuperuser) {
            var userLicenseId = AuthService.getLicenseId();
            $scope.formUser.licenseId = userLicenseId;
        }
    };

    $scope.goToCreateUser = function() {
        $state.go('base.user-new'); 
    };
    $scope.createUser = function() {
        var userLicenseId = AuthService.getLicenseId();
        
        if (!$scope.isSuperuser()) {
            $scope.formUser.licenseId = userLicenseId;
        }
    
        var userData = {
            ...$scope.formUser,
            license_id: $scope.formUser.licenseId 
        };
        delete userData.licenseId; 
    
        UserService.createUser(userData).then(function(response) {
            alert('User created successfully');
            $scope.getAllUsers();
            $scope.resetForm();
            $state.go('base.user-view');
        }).catch(function(error) {
            console.error('Error creating user:', error);
            if (error.data && error.data.detail) {
                alert('Error details: ' + JSON.stringify(error.data.detail));
            }
        });
    };
    
    $scope.cancelCreate = function() {
        $state.go('base.user-view');
    };
    $scope.editUser = function(userId) {
        $state.go('base.user-update', { userId: userId });
    };
    $scope.goBack = function() {
        $state.go('base.home');
    }; 

    $scope.deleteUser = function(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            UserService.deleteUser(userId).then(function(response) {
                alert('User deleted successfully!');
                $scope.getAllUsers();
            }).catch(function(error) {
                console.error('Error deleting user:', error);
            });
        }
    };

    $scope.resetForm = function() {
        $scope.formUser = {};
        $scope.isEditing = false;
        $scope.initForm();
    };
    
    $scope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };

    $scope.fetchUserDetails();
    $scope.getAllUsers();
    $scope.getAllLicenses();
    $scope.initForm();
}]);
