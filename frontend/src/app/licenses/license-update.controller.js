angular.module('frontend').controller('LicenseUpdateController', ['$scope', 'LicenseService', '$stateParams', '$state', function($scope, LicenseService, $stateParams, $state) {
    $scope.formLicense = {}; 
    $scope.isEditing = true;
    
    $scope.loadLicenseData = function() {
        const licenseId = $stateParams.licenseId; 
        
        LicenseService.getById(licenseId).then(function(response) {
            if (response.data && response.data.length > 0) {
                $scope.formLicense = response.data[0];
            } else {
                console.error('License not found');
                alert('License not found.');
                $state.go('base.list_licenses'); 
            }
        }).catch(function(error) {
            console.error('Error fetching license data:', error);
            alert('Error fetching license data.');
        });
        
        
    };

    $scope.updateLicense = function() {
        var licenseDataToUpdate = angular.copy($scope.formLicense);
    
        if (licenseDataToUpdate.start_date) {
            licenseDataToUpdate.start_date = moment(licenseDataToUpdate.start_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }
    
        if (licenseDataToUpdate.end_date) {
            licenseDataToUpdate.end_date = moment(licenseDataToUpdate.end_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }
    
        LicenseService.update(licenseDataToUpdate.id, licenseDataToUpdate).then(function(response) {
            alert('License updated successfully');
            $state.go('base.list_licenses'); 
        }).catch(function(error) {
            console.error('Error updating license:', error);
            alert('Error updating license.');
        });
    };
    $scope.cancelUpdate = function() {
        $state.go('base.list_licenses');
    };
    
    

    $scope.loadLicenseData(); 
}]);
