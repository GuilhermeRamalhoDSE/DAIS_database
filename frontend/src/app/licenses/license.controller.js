angular.module('frontend').controller('LicenseController', ['$scope', 'LicenseService', 'AvatarService', '$state', function($scope, LicenseService, AvatarService, $state) {
    $scope.licenses = [];
    $scope.avatars = [];
 
    $scope.newLicense = {
        name: "",
        email: "",
        address: "",
        tel: "",
        license_code: "",
        active: true,
        start_date: "",
        end_date: "",
        avatars_ids: []
    };

    $scope.getAllLicenses = function() {
        LicenseService.getAll().then(function(response) {
            $scope.licenses = response.data;
        }).catch(function(error) {
            alert('Error fetching licenses:', error);
        });
    };

    $scope.loadAvatars = function() {
        AvatarService.getAvatars().then(function(response) {
            $scope.avatars = response.data;
        }).catch(function(error) {
            alert('Error fetching avatars:', error);
        });
    };

    $scope.goToCreateLicense = function() {
        $state.go('base.licenses-new');
    };

    $scope.createLicense = function() {
        var licenseData = angular.copy($scope.newLicense);
        
        if (licenseData.start_date) {
            licenseData.start_date = moment(licenseData.start_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }
        if (licenseData.end_date) {
            licenseData.end_date = moment(licenseData.end_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }

        LicenseService.create(licenseData).then(function(response) {
            alert('License created successfully!');
            $scope.getAllLicenses();
            $scope.newLicense = {
                name: "",
                email: "",
                address: "",
                tel: "",
                license_code: "",
                active: true,
                start_date: "",
                end_date: "",
                avatars_ids: []
            };
            $state.go('base.licenses-view'); 
        }).catch(function(error) {
            alert('Error creating license:', error);
        });
    };

    $scope.cancelCreate = function() {
        $state.go('base.licenses-view');
    };

    $scope.editLicense = function(licenseId) {
        $state.go('base.licenses-update', { licenseId: licenseId }); 
    };

    $scope.goBack = function() {
        $state.go('base.home');
    }; 
    
    $scope.deleteLicense = function(licenseId) {
        if (confirm('Are you sure you want to delete this license?')) {
            LicenseService.delete(licenseId).then(function(response) {
                alert('License successfully deleted!');
                $scope.getAllLicenses();
            }).catch(function(error) {
                alert('Error deleting license:', error);
            });
        }
    };

    $scope.toggleAvatarAssignment = function(license, avatarId) {
        const isAssigned = $scope.isAvatarAssignedToLicense(license, avatarId);
        if (isAssigned) {
            LicenseService.removeAvatarFromLicense(license.id, avatarId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error removing avatar from license:', error);
                });
        } else {
            LicenseService.addAvatarToLicense(license.id, avatarId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error adding avatar to license:', error);
                });
        }
    };
    
    $scope.isAvatarAssignedToLicense = function(licenseId, avatarId) {
        const license = $scope.licenses.find(license => license.id === licenseId);
        return license && license.avatars_ids.includes(avatarId);
    };
    
    $scope.getAllLicenses(); 
    $scope.loadAvatars();
}]);
