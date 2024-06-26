angular.module('frontend').controller('UserController', ['$scope', 'UserService', '$state', 'AuthService', 'LicenseService', '$location', '$filter', function($scope, UserService, $state, AuthService, LicenseService, $location, $filter) {
    $scope.users = [];
    $scope.formUser = {};
    $scope.isEditing = false;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.userName = '';
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;
    $scope.showPassword = false;
    $scope.licenses = [];

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.users, $scope.searchText);
        var startIndex = $scope.currentPage * $scope.pageSize;
        var endIndex = Math.min(startIndex + $scope.pageSize, filteredList.length);
        return filteredList.slice(startIndex, endIndex);
    };
    
    $scope.setCurrentPage = function(page) {
        if (page >= 0 && page < $scope.totalPages()) {
            $scope.currentPage = page;
        }
    };
    
    $scope.totalPages = function() {
        return Math.ceil($scope.users.length / $scope.pageSize);
    };
    
    $scope.getPages = function() {
        var pages = [];
        var total = $scope.totalPages();
        var startPage = Math.max(0, $scope.currentPage - Math.floor($scope.visiblePages / 2));
        var endPage = Math.min(total, startPage + $scope.visiblePages);
    
        if (startPage > 0) {
            pages.push(0);
            if (startPage > 1) {
                pages.push('...');
            }
        }
    
        for (var i = startPage; i < endPage; i++) {
            pages.push(i);
        }
    
        if (endPage < total) {
            if (endPage < total - 1) {
                pages.push('...');
            }
            pages.push(total - 1);
        }
    
        return pages;
    };

    $scope.getAllUsers = function() {
        UserService.getAllUsers().then(function(response) {
            $scope.users = response.data;
        }).catch(function(error) {
            console.error('Error fetching users:', error);
        });
    };

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
        if ($scope.isSuperuser()) {
            $state.go('base.home-su');
        } else {
            $state.go('base.home-admin');
        }
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
