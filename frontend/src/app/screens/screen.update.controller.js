angular.module('frontend').controller('ScreenUpdateController', ['$scope', 'ScreenService', '$state', '$stateParams', 'AuthService', 'LicenseService', function($scope, ScreenService, $state, $stateParams, AuthService, LicenseService) {
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.totemId = parseInt($stateParams.totemId || sessionStorage.getItem('lasttotemId'), 10);
    $scope.totemName = $stateParams.totemName || sessionStorage.getItem('lasttotemName');
    $scope.screenId = $stateParams.screenId;

    $scope.screenData = {
        typology: null,
        footer: ''
    };
    $scope.logo = null;
    $scope.background = null;
    $scope.screenTypes = [];

    $scope.loadScreenDetails = function() {
        if ($scope.screenId) {
            ScreenService.getById($scope.screenId).then(function(response) {
                if (response.data) {
                    $scope.screenData = response.data;
                    $scope.screenData.typology_id = response.data.typology.id;
                } else {
                    console.error('Screen not found');
                    alert('Screen not found.');
                    $state.go('base.screen-view', { clientId: $scope.clientId,
                        clientName: $scope.clientName,
                        groupId: $scope.groupId,
                        groupName: $scope.groupName,
                        totemId: $scope.totemId,
                        totemName: $scope.totemName });
                }
            }).catch(function(error) {
                console.error('Error fetching screen details:', error);
            });
        } else {
            console.log('No screen ID provided.');
        }
    };

    $scope.loadScreenType = function() {
        if ($scope.licenseId) {
            LicenseService.getScreenTypeByLicense($scope.licenseId).then(function(response) {
                $scope.screenTypes = response.data;
            }).catch(function(error) {
                console.error('Error loading screen types:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    }; 

    $scope.updateScreen = function() {
        var formData = new FormData();
        if ($scope.logo) {
            formData.append('logo', $scope.logo);
        }
        if ($scope.background) {
            formData.append('background', $scope.background);
        }

        formData.append('screen_in', JSON.stringify($scope.screenData));

        ScreenService.update($scope.screenId, formData).then(function(response) {
            alert('Screen updated successfully!');
            $state.go('base.screen-view', { clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                totemId: $scope.totemId,
                totemName: $scope.totemName  });
        }).catch(function(error) {
            console.error('Error updating screen:', error);
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.screen-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            totemId: $scope.totemId,
            totemName: $scope.totemName
        });
    };

    $scope.upload = function(file) {
        var deferred = $q.defer(); 
    
        $scope.showProgress = true;
        $scope.loadingProgress = 0;
    
        var progressInterval = $interval(function() {
            $scope.loadingProgress += 10; 
            if ($scope.loadingProgress >= 100) {
                $interval.cancel(progressInterval); 
                deferred.resolve(); 
            }
        }, 500); 
    
        return deferred.promise; 
    };

    $scope.loadScreenDetails();
    $scope.loadScreenType();
}]);
