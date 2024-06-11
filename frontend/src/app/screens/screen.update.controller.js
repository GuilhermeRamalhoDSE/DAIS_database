angular.module('frontend').controller('ScreenUpdateController', ['$scope', 'ScreenService', '$state', '$stateParams', 'AuthService', 'LicenseService', '$q', '$interval', 'Upload', function($scope, ScreenService, $state, $stateParams, AuthService, LicenseService, $q, $interval, Upload) {
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
    };
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
        ScreenService.update($scope.screenId, $scope.screenData).then(function(response) {
            alert('Screen updated successfully!');
            $state.go('base.screen-view', {
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                totemId: $scope.totemId,
                totemName: $scope.totemName
            });
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

    $scope.loadScreenDetails();
    $scope.loadScreenType();
}]);
