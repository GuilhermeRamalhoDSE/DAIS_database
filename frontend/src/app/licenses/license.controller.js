angular.module('frontend').controller('LicenseController', ['$scope', 'LicenseService', '$state', function($scope, LicenseService, $state) {
    $scope.licenses = [];
    $scope.isEditing = false;
 
    $scope.newLicense = {
        name: "",
        email: "",
        address: "",
        tel: "",
        license_code: "",
        active: true,
        start_date: "",
        end_date: ""
    };

    $scope.getAllLicenses = function() {
        LicenseService.getAll().then(function(response) {
            $scope.licenses = response.data;
        }).catch(function(error) {
            alert('Error fetching licenses:', error);
        });
    };

    $scope.goToCreateLicense = function() {
            $state.go('base.licenses');
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
                end_date: ""
            };
            $state.go('base.list_licenses'); 
        }).catch(function(error) {
            alert('Error creating license:', error);
        });
    };
    $scope.cancelCreate = function() {
        $state.go('base.list_licenses');
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

    $scope.getAllLicenses(); 
}]);
